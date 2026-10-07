# KERT 웹 백엔드 스터디 - 1주차
 
## 실행 방법

1. 레포 clone하기
```bash
   git clone https://github.com/zlnzzaro/KERT-Backend-Study.git
```
2. 프로젝트 폴더로 이동
```bash
   cd KERT-Backend-Study/week01
```
3. 필요한 패키지(express, nodemon) 설치
```bash
   npm install
```
4. 서버 실행(개발용)
```bash
   npm run dev
```
5. 브라우저에서 http://localhost:3001 에 접속하면 끝!


## 구현한 라우트

| 경로 | 보여주는 것 |
|---|---|
| `/` | "Hello Express!" 환영 문구 |
| `/photo` | `public` 폴더에 넣은 사진(`photo.jpg`) |
| `/time` | 접속한 시각 (새로고침할 때마다 갱신) |
| `/about` | 자기소개 페이지 |
| `/posts` | `renderPostList`로 만든 게시판 글 목록 |
| 그 외 경로 | 404 페이지 (없는 경로로 접속했을 때) |
 
## 연습 문제
10 / 10 통과

## (도전) /time 이 새로고침할 때마다 바뀌는 이유
 
`new Date()` 가 라우트 함수 안에 있기 때문입니다. 라우트 함수는 서버가 켜질 때 실행되는 게 아닌, 요청이 들어올 때마다 실행됩니다. 새로고침을 하면 브라우저가 서버에 /time 요청을 새로 보내고, 그때마다 함수가 처음부터 다시 실행 되면서 매번 다른 시각이 응답으로 가게 됩니다.
 