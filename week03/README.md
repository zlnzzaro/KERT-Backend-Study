# KERT 웹 백엔드 스터디 - 3주차

## 실행 방법

Node.js 22.13 이상이 필요합니다.

```bash
git clone https://github.com/zlnzzaro/KERT-Backend-Study
cd KERT-Backend-Study/week03
npm install
node app.js
```

브라우저에서 http://localhost:3000/posts 접속

## 관리자 계정 만드는 법

1. http://localhost:3000/signup 에서 회원가입
2. 서버를 켠 상태로 터미널에서 `node make-admin.js <아이디>` 실행
3. 로그아웃 후 같은 아이디로 다시 로그인 → `/admin` 접속 가능

## 구현한 라우트

| 메서드 | 주소 | 설명 (누가) |
|---|---|---|
| GET | /signup | 회원가입 화면 (누구나) |
| POST | /signup | 회원가입 (누구나) |
| GET | /login | 로그인 화면 (누구나) |
| POST | /login | 로그인 (누구나) |
| POST | /logout | 로그아웃 (로그인한 사람) |
| GET | /posts | 글 목록 (누구나) |
| GET | /posts/:id | 글 상세 (누구나) |
| GET | /posts/new | 글쓰기 화면 (로그인한 사람) |
| POST | /posts | 글 저장 (로그인한 사람) |
| POST | /posts/:id/delete | 글 삭제 (작성자 · 관리자) |
| GET | /admin | 회원 목록 (관리자) |

## 점검 결과

필수 22 / 22 통과
도전 3 / 3 통과

## (도전) 구현한 것

- 내 글 모아보기: `GET /my` (로그인한 사람)
- 회원 권한 바꾸기: `POST /admin/users/:id/role` (관리자)
- 댓글: `POST /posts/:id/comments` (로그인한 사람), 상세 페이지에서 댓글 보기