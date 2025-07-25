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
npm run dev
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
VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000
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
