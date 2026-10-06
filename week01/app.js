const express = require('express');

const app = express();
const PORT = 3000;

app.get('/',(req,res) => { // app.get : 이 경로로 요청이 오면
    res.send('<h1>Hello Express!</h1>'); // res.send: 이걸 응답으로 보낸다
});

app.listen(PORT,(err) => { // app.listen: 3000번 포트에서 기다린다
    if(err) throw err;
    console.log(`서버 실행 중:http://localhost:${PORT}`);
});

// 경로에서 Get 요청을 받았을 경우 처리하는 함수
app.get('/about', (req, res) => {
  res.send(`
    <link rel="stylesheet" href="https://cdn.simplecss.org/simple.min.css">

    <h1>About Me</h1>
    <p>안녕하세요, 저는 컴퓨터학부 24학번 김유진입니다.</p>
    <img src="/photo.jpg" alt="프로필 사진">
    <h2>Info</h2>
    <ul>
        <li> 2005.09.19
        <li> MBTI : INTP
        <li> Major : 컴퓨터학부 글로벌SW융합전공 (2학년)
        <li> KERT 홍보부장 - <a href="https://www.instagram.com/knu_kert/" target="_blank" rel="noopener noreferrer">KERT</a> 홍보물 게시
        <li> <a href="https://github.com/zlnzzaro" target="_blank" rel="noopener noreferrer">GitHub</a></li>


    </ul>
    <h3>취미</h3>
    <ul>
        <li> 팝송 & EDM 듣기
        <li> 산책
        <li> 영화 보기
        <li> 다큐멘터리 보기
        <li> 외국어 공부하기
    </ul>
    <h4>좋아하는 캐릭터</h4>
    <ul>
        <li> 루피 Loopy
    </ul>
  `);
});

//1번 과제: 사진 추가
app.use(express.static('public'));
app.get('/photo', (req,res) => {
    res.send('<img src="/photo.jpg">');
});

//2번 과제: 접속한 시간 보여주기
app.get('/time', (req,res) => {
    const now = new Date();
    res.send(`<h1>접속 시각</h1><p>${now.toLocaleString('ko-KR')}</p>`);
});