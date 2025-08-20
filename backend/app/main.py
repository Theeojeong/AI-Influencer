from app.router import blog, core, core_check, process_check, healthcheck, test, sns, biz_info, biz_contacts, google_auth, kakao_auth, exaone
from fastapi import FastAPI, UploadFile, File, Request
from fastapi.middleware.cors import CORSMiddleware
from app.logger import setup_logging
from app.auth.token import SECRET_KEY
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.middleware.sessions import SessionMiddleware
from starlette.responses import Response, FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import base64
import time
import logging
import os


app = FastAPI()

# 로깅 설정
setup_logging()

# 미들웨어 추가
class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_body = await request.body()
        logging.info(f"Request: {request.method} {request.url} - Body: {request_body}")
        start_time = time.time()
        response: Response = await call_next(request)
        process_time = time.time() - start_time
        logging.info(f"Response: {response.status_code} - Process Time: {process_time:.4f}s")
        return response

# CORS 설정 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 도메인 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용 (GET, POST, DELETE 등)
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

# 로깅 미들웨어 추가
app.add_middleware(LoggingMiddleware)

# SessionMiddleware 등록
app.add_middleware(
    SessionMiddleware,
    secret_key=SECRET_KEY  # 반드시 안전한 키로 설정하세요
)

# 라우터 등록
app.include_router(healthcheck.router)
app.include_router(process_check.router)
app.include_router(blog.router)
app.include_router(sns.router)
app.include_router(core.router)
app.include_router(google_auth.router)
app.include_router(kakao_auth.router)
app.include_router(biz_info.router)
app.include_router(biz_contacts.router)
app.include_router(exaone.router)
app.include_router(core_check.router)
app.include_router(test.router)

# ===== Serve React build (frontend) on root, if available =====
def _build_dir() -> str:
    # backend/app/main.py -> repo_root/frontend/build
    here = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.abspath(os.path.join(here, "../../frontend/build"))
    return build_dir


BUILD_DIR = _build_dir()
if os.path.isdir(BUILD_DIR):
    # Serve static assets under /static (CRA output)
    static_path = os.path.join(BUILD_DIR, "static")
    if os.path.isdir(static_path):
        app.mount("/static", StaticFiles(directory=static_path), name="static")

    # Root index.html
    @app.get("/", include_in_schema=False)
    async def index():
        return FileResponse(os.path.join(BUILD_DIR, "index.html"))

    # SPA fallback: serve actual file if exists, otherwise index.html
    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str):
        target = os.path.join(BUILD_DIR, full_path)
        if os.path.isfile(target):
            return FileResponse(target)
        return FileResponse(os.path.join(BUILD_DIR, "index.html"))

# 실행
if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
