# SKN03-FINAL-4TEAM

<div align="center">
  <h2>🛠 기술 스택 개요</h2>
  
  <h3>Backend Framework</h3>
  <img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=FastAPI&logoColor=white">
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white">
  <img src="https://img.shields.io/badge/Pydantic-E92063?style=for-the-badge&logo=Pydantic&logoColor=white">
  <img src="https://img.shields.io/badge/Uvicorn-4051B5?style=for-the-badge&logo=Uvicorn&logoColor=white">
  <br>
  
  <h3>Database & ORM</h3>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
  <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=SQLAlchemy&logoColor=white">
  <br>
  
  <h3>AI & LLM</h3>
  <img src="https://img.shields.io/badge/OpenAI-412991?style=for-the-badge&logo=OpenAI&logoColor=white">
  <img src="https://img.shields.io/badge/LangChain-339933?style=for-the-badge&logo=Chain&logoColor=white">
  <img src="https://img.shields.io/badge/Ollama-FF4B4B?style=for-the-badge&logo=Ollama&logoColor=white">
  <br>
  
  <h3>데이터 처리</h3>
  <img src="https://img.shields.io/badge/FAISS-00ADD8?style=for-the-badge&logo=Meta&logoColor=white">
  <img src="https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=NumPy&logoColor=white">
  <img src="https://img.shields.io/badge/Pandas-150458?style=for-the-badge&logo=Pandas&logoColor=white">
  <br>
  
  <h3>Frontend Framework</h3>
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black">
  <img src="https://img.shields.io/badge/Redux-764ABC?style=for-the-badge&logo=Redux&logoColor=white">
  <img src="https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=React-Query&logoColor=white">
  <br>
  
  <h3>Frontend 통신</h3>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=Axios&logoColor=white">
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=Socket.io&logoColor=white">
  <br>
  
  <h3>인증 & 보안</h3>
  <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=for-the-badge&logo=Google&logoColor=white">
  <img src="https://img.shields.io/badge/Kakao_OAuth-FFCD00?style=for-the-badge&logo=Kakao&logoColor=black">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white">
  <img src="https://img.shields.io/badge/Passlib-000000?style=for-the-badge&logo=Python&logoColor=white">
  <br>
  
  <h3>인프라 & 배포</h3>
  <img src="https://img.shields.io/badge/Amazon_AWS-232F3E?style=for-the-badge&logo=Amazon-AWS&logoColor=white">
  <img src="https://img.shields.io/badge/AWS_CodeBuild-FF9900?style=for-the-badge&logo=Amazon-AWS&logoColor=white">
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=Docker&logoColor=white">
  <br>
  
  <h3>코드 품질 & 개발 도구</h3>
  <img src="https://img.shields.io/badge/PyTest-0A9EDC?style=for-the-badge&logo=PyTest&logoColor=white">
  <img src="https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=ESLint&logoColor=white">
  <img src="https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=Prettier&logoColor=black">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=Git&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=GitHub&logoColor=white">
  <br>
  
  <h3>모니터링 & 문서화</h3>
  <img src="https://img.shields.io/badge/CloudWatch-FF4F8B?style=for-the-badge&logo=Amazon-AWS&logoColor=white">
  <img src="https://img.shields.io/badge/Loguru-00ADD8?style=for-the-badge&logo=Python&logoColor=white">
  <img src="https://img.shields.io/badge/Swagger-85EA2D?style=for-the-badge&logo=Swagger&logoColor=black">
</div>

## 🖼 데모 스크린샷

<p align="center">
  <img src="image.png" alt="홈페이지 데모" width="800" />
  <br/>
  <sub>로컬 경로 C:\\SKN03-FINAL\\image.png에서 가져온 데모 이미지</sub>
  
</p>

## ⚡ 빠른 시작(로컬 실행 요약)

- 요구 사항: Python 3.10+, Node.js LTS 설치
- 실행 순서는 “프론트 빌드 → 백엔드 실행 → 브라우저 접속”입니다.

1) 키(.env) 준비
```env
# 위치: C:\SKN03-FINAL\.env (또는 backend\.env)
OPENAI_API_KEY=발급받은키
# 본문 생성에 필요
GOOGLE_API_KEY=발급키
GOOGLE_CSE_ID=발급ID
```

2) 프론트 빌드(CRA)
```bash
cd frontend
echo REACT_APP_SERVER_URL=http://127.0.0.1:8000/ > .env
npm install
npm run build
```

3) 백엔드 실행(FastAPI)
```bash
cd backend
# 가상환경이 없다면 최초 1회
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

4) 접속 경로
- 앱: http://127.0.0.1:8000/daily (Daily 페이지에서 AI 추천/생성 기능)
- API 문서: http://127.0.0.1:8000/docs

5) 참고
- DB 없이도 Daily의 AI 제목/본문 생성은 동작합니다. “제출하기(저장)”와 블로그 목록/댓글/좋아요는 DB 필요.
- 이미지 업로드는 AWS 자격이 필요합니다. 로컬 테스트에서는 이미지를 업로드하지 않는 것을 권장합니다.

## 🛠 문제 해결(자주 발생)

- /daily가 404인 경우: 프론트를 빌드(npm run build)하고 백엔드를 재시작하세요.
- “제목 추천 중 오류” 또는 401 Unauthorized: OPENAI_API_KEY가 비어있거나 기본값입니다. .env에 실제 키를 넣고 서버 재시작.
- “글 생성” 실패: GOOGLE_API_KEY, GOOGLE_CSE_ID를 .env에 넣었는지 확인.
- 요청 경로가 /undefinedblog/... 로 보이면: 프론트를 다시 빌드하세요(npm run build 후 백엔드 재시작).
- AWS SSM 자격 오류: 로컬에서는 무시해도 됩니다(이미지 업로드 기능만 제한). 키는 .env로 읽도록 구성되어 있습니다.

## 🔧 프론트 개발 모드로 보기(선택)

백엔드(8000)를 띄운 상태에서 프론트를 개발 서버로 실행할 수도 있습니다.
```bash
cd frontend
echo REACT_APP_SERVER_URL=http://127.0.0.1:8000/ > .env
npm install
npm start
# 접속: http://localhost:3000
```

## 📁 프로젝트 구조

```
SKN03-FINAL-4TEAM/
├── backend/                   # FastAPI 백엔드 서버
├── frontend/                  # React 프론트엔드
├── LLMcore/                  # AI 챗봇 엔진
└── ollama-docker/            # Ollama 모델 서버
```

## 🚀 주요 기능

### Backend 시스템
- FastAPI 기반 RESTful API
- JWT 기반 인증 시스템
- MySQL 데이터베이스 연동
- 소셜 로그인 (Google, Kakao)
- AWS 클라우드 통합

### AI 챗봇 시스템
- OpenAI GPT 모델 통합
- LangChain 기반 대화 관리
- Ollama 로컬 모델 지원
- 컨텍스트 기반 대화 처리
- 프롬프트 엔지니어링

### Frontend 인터페이스
- React 기반 SPA
- Redux 상태 관리
- 실시간 채팅 인터페이스
- 반응형 디자인
- 소셜 로그인 통합

## 💻 설치 및 실행

### Backend 설정
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend 설정
```bash
cd frontend
npm install
npm start
```

### LLMcore 설정
```bash
cd LLMcore
pip install -r requirements.txt
python openai_chatbot/main.py
```

### Ollama 설정
```bash
cd ollama-docker
docker build -t ollama-custom .
docker run -d -p 11434:11434 ollama-custom
```

## 🔧 환경 변수 설정

각 컴포넌트별 `.env` 파일이 필요합니다:

### Backend (.env)
```env
DATABASE_URL=mysql+asyncmy://user:password@localhost:3306/dbname
JWT_SECRET_KEY=your-secret-key
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
KAKAO_CLIENT_ID=your-kakao-client-id
```

### Frontend (.env)
```env
# CRA 기준. 백엔드 주소(슬래시로 끝나게)
REACT_APP_SERVER_URL=http://localhost:8000/
```

### LLMcore (.env)
```env
OPENAI_API_KEY=your-openai-api-key
MODEL_NAME=gpt-3.5-turbo
OLLAMA_HOST=http://localhost:11434
```

## 📚 API 문서
- Backend API: `http://localhost:8000/docs`
- Swagger UI: `http://localhost:8000/redoc`

## 🧪 테스트

### Backend 테스트
```bash
cd backend
pytest
```

### Frontend 테스트
```bash
cd frontend
npm test
```

### LLMcore 테스트
```bash
cd LLMcore
pytest tests/
```

## 🔍 모니터링
- Backend 헬스체크: `/healthcheck`
- 로그 확인: `backend/app.log`
- AWS CloudWatch 통합

## 👥 팀원 및 역할
- Backend & 인프라: 김성은
- Frontend: 구나연
- AI & LLM: 정재현, 문건우
- DevOps: 김성은, 문건우

---

## 🧭 로컬 실행 가이드(백엔드에서 프론트 서빙)

아래 절차를 따르면 FastAPI(8000 포트)에서 프론트엔드 정적 파일을 함께 제공합니다.

1) 프론트엔드 환경변수와 빌드
```bash
cd frontend
echo REACT_APP_SERVER_URL=http://127.0.0.1:8000/ > .env
npm install
npm run build
```

2) 백엔드 실행
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

3) 접속 경로
- 앱: http://127.0.0.1:8000 (상단 메뉴의 daily 사용)
- API 문서: http://127.0.0.1:8000/docs

4) 주의사항
- DB 없이도 daily의 AI 제목/본문 생성은 동작합니다. 단, 글 저장/목록/댓글/좋아요는 DB 필요.
- LLM 기능은 다음 키가 필요합니다(.env 또는 OS 환경변수):
  - `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `GOOGLE_CSE_ID`
