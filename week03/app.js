const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const app = express();

const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('board.db'); //board.db 파일을 열고, 없으면 새로 만듦

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));   // form 데이터 → req.body
app.use(session({ secret: 'kert-week03-secret', resave: false, saveUninitialized: false }));
app.use((req, res, next) => {
    res.locals.user = req.session.user ?? null;      // 모든 ejs에서 user 사용 가능
    next();
});

//데이터베이스 - 테이블 만들기
db.exec(`
    CREATE TABLE IF NOT EXISTS users(
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role    TEXT NOT NULL DEFAULT 'user'
    );

CREATE TABLE IF NOT EXISTS posts (
    id  INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    user_id INTEGER NOT NULL
 );
`);

app.get('/posts/new', requireLogin,(req,res) => {
    res.render('new');
});

//글 상세
app.get('/posts/:id',(req,res)=> {
    const id = Number(req.params.id);
    const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(id);
    if(!post) return res.status(404).send('글이 없습니다.');
    res.render('detail',{ post });
});

//목록
app.get('/posts',(req,res)=> {
    const posts = db.prepare(`
        SELECT posts.id, posts.title, users.username
        FROM posts JOIN users ON posts.user_id = users.id
        ORDER BY posts.id
        `).all();
        res.render('list',{ posts });
});

//회원가입
const bcrypt = require('bcryptjs');
app.get('/signup',(req,res) => {
    res.render('signup', {error: null});
});

app.post('/signup',(req,res) => {
    const { username, password } = req.body;
    const exists = db.prepare('SELECT id FROM users WHERE username=?'.get(username));
    if(exists) {
        return res.render('signup',{ error: '이미 있는 아이디입니다'});
    }
    const hash = bcrypt.hashSync(password,10); //비밀번호를 해시하여 저장함 (절대 평문을 저장하지 말 것!)
    db.prepare('INSERT INTO users(username,password)VALUES(?,?)').run(username,hash);
    res.redirect('/login');
});

//세션-로그인 상태 유지하기
app.use(session({ secret: 'kert-week03-secret',resave:false, saveUninitialized: false}));
app.use((req,res,next) => {
    res.locals.user = req.session.user ?? null;
    next();
});

//로그인
app.get('/login',(req,res)=> {
    res.render('login', { error:null });
});

app.post('/login',(req,res)=> {
    const { username, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE username =?').get(username);
    if(!user || !bcrypt.compareSync(password,user.password)) {
        return res.render('login', { error: '아이디 또는 비밀번호가 틀렸습니다'});
    }
    req.session.user = { id: user.id, username: user.username, role: user.role};
    res.redirect('/posts');
});

//로그아웃
app.post('/logout',(req,res) => {
    req.session.destroy(() => {
        res.redirect('/posts');
    });
});

//미들웨어로 로그인 확인
function requireLogin(req,res,next) {
    if(!req.session.user) {
        return res.redirect('/login');
    }
    next();
}

//글쓰기 - 로그인한 사람만 작성 가능. 작성자는 세션 값으로 기록
app.post('/posts',requireLogin,(req,res)=> { 
    const { title, content } = req.body;
    const result = db
        .prepare('INSERT into posts(title, content, user_id) VALUES (?, ?, ?)')
        .run(title, content, req.session.user.id);
    res.redirect(`/posts/${result.lastInsertRowid}`);
});
app.post('/posts/:id/delete',requireLogin,(req,res) => {/*삭제*/});

//글 저장
const result = db
    .prepare('INSERT INTO posts(title, content, user_id) VALUES(?,?,?)')
    .run(title,content,req.session.user.id);

//지우기 전에 서버에서 한번 더 확인
app.post('/posts/:id/delete', requireLogin,(req,res)=> {
    const id = Number(req.params.id);
    const post = db.prepare('SELECT * FROM posts WHERE id = ?'.get(id));
    if(!post) {
        return res.status(404).send('글이 없습니다.');
    }
    const me = req.session.user;
    if(post.user_id !== me.id && me.role !== 'admin') {
        return res.status(403).send('내 글만 삭제할 수 있습니다.');
    }
    db.prepare('DELETE FROM posts WHERE id=?'.run(id));
    res.redirect('/posts');
});

// 내 글 모아보기 - 로그인한 사람이 쓴 글만 목록으로 보여주기
app.get('/my', requireLogin, (req, res) => {
    const posts = db.prepare(`
        SELECT posts.id, posts.title, users.username
        FROM posts JOIN users ON posts.user_id = users.id
        WHERE posts.user_id = ?
        ORDER BY posts.id
    `).all(req.session.user.id);
    res.render('list', { posts });
});

//관리자 페이지
function requireAdmin(req,res,next) {
    if(!req.session.user || req.session.user.role !== 'admin') {
        return res.status(403).send('관리자만 볼 수 있습니다.');
    }
    next();
}

app.get('/admin',requireAdmin,(req,res) => {
    const users = db
        .prepare("SELECT id, username, role FROM users ORDER BY id")
        .all();
    res.render('admin',{users});
});

//관리자가 회원 권한 바꾸기
app.post('/admin/users/:id/role', requireAdmin, (req, res) => {
    const id = Number(req.params.id);
    if (id === req.session.user.id) {
        return res.status(400).send('자기 권한은 바꿀 수 없습니다.');
    }
    db.prepare(`
        UPDATE users
        SET role = CASE WHEN role = 'admin' THEN 'user' ELSE 'admin' END
        WHERE id = ?
    `).run(id);
    res.redirect('/admin');
});



app.listen(3000, () => console.log('http://localhost:3000'));