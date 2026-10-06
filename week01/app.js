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

app.get('/about',(req,res) => { // 경로에서 Get 요청을 받았을 경우 처리하는 함수
    res.send('<h1>안녕하세요 컴퓨터학부 24학번 김유진입니다.</h1><p>KERT 웹 백엔드 스터디 1기</p>'); // 응답 부분
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