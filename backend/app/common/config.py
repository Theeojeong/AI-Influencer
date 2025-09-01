from app.common.consts import REGION_NAME
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
import boto3
import os
import logging
from dotenv import load_dotenv, find_dotenv

# Load .env from repo root if present (for local development)
_dotenv_path = find_dotenv(usecwd=True)
if _dotenv_path:
    load_dotenv(_dotenv_path, override=True)


def _env_key_from_ssm(name: str) -> str:
    # Convert "/MYAPP/DB/USERNAME" -> "DB_USERNAME"
    parts = name.strip("/").split("/")
    return "_".join(parts[1:]) if len(parts) > 1 else parts[0]


def get_parameter(name, with_decryption=True, default: str | None = None):
    """
    Resolve a configuration value with the following precedence:
    1) Environment variables (with common fallbacks, e.g., DB_USER -> DB_USERNAME)
    2) If DEV_MODE=mock or DISABLE_SSM=1: return default (or "") without calling SSM
    3) AWS SSM Parameter Store
    """
    # 1) Prefer environment variable for local development (with fallbacks)
    env_key = _env_key_from_ssm(name)
    env_val = os.getenv(env_key)
    if env_val in (None, ""):
        # Backward-compat fallbacks for common keys
        fallbacks = {
            "DB_USERNAME": ["DB_USER"],
            "DB_DB_NAME": ["DB_NAME"],
        }
        for alt in fallbacks.get(env_key, []):
            env_val = os.getenv(alt)
            if env_val not in (None, ""):
                break
    if env_val not in (None, ""):
        return env_val

    # 2) Skip SSM entirely in local/mock mode
    if os.getenv("DEV_MODE", "").lower() == "mock" or os.getenv("DISABLE_SSM") == "1":
        # In mock mode, do not warn; just use default or empty
        if default is not None:
            return default
        return ""

    # 3) Try AWS SSM (for deployed environments)
    try:
        client = boto3.client('ssm', region_name="ap-northeast-2")
        response = client.get_parameter(Name=name, WithDecryption=with_decryption)
        return response['Parameter']['Value']
    except Exception as e:
        if default is not None:
            logging.warning(f"SSM fetch failed for {name}. Using default/env. Error: {e}")
            return default
        logging.warning(f"SSM fetch failed for {name}. Set env '{env_key}' to run locally. Error: {e}")
        return ""


# Parameter Store에서 값을 가져오되, 로컬에선 환경변수/기본값 사용
db_username = get_parameter("/MYAPP/DB/USERNAME", default="root")
db_password = get_parameter("/MYAPP/DB/PASSWORD", default="")
db_host = get_parameter("/MYAPP/DB/HOST", default="127.0.0.1")
db_port = get_parameter("/MYAPP/DB/PORT", default="3306")
db_name = get_parameter("/MYAPP/DB/DB_NAME", default="test")
s3_name = get_parameter("/MYAPP/S3/NAME", default=os.getenv("AWS_ACCESS_KEY_ID", ""))
s3_key = get_parameter("/MYAPP/S3/KEY", default=os.getenv("AWS_SECRET_ACCESS_KEY", ""))

# DATABASE_URL 우선 순위: ENV > 조합값
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    f"mysql+asyncmy://{db_username}:{db_password}@{db_host}:{db_port}/{db_name}"
)

# KAKAO AUTH (로컬 기본값 허용)
kakao_id = get_parameter("/MYAPP/KAKAO/AUTH/NAME", default=os.getenv("KAKAO_ID", ""))
kakao_pwd = get_parameter("/MYAPP/KAKAO/AUTH/PWD", default=os.getenv("KAKAO_PWD", ""))
kakao_redirect_url = os.getenv("KAKAO_REDIRECT_URL", "http://127.0.0.1:8000/auth/kakao/callback")

OLLAMA_API_URL = get_parameter("/MYAPP/sLLM/BASE", default=os.getenv("OLLAMA_API_URL", "http://localhost:11434"))

# S3 클라이언트 생성 (자격 없더라도 생성만, 실제 업로드 시 실패 가능)
s3_client = boto3.client(
    "s3",
    aws_access_key_id=s3_name or None,
    aws_secret_access_key=s3_key or None,
    region_name=REGION_NAME,
)

# 비동기 엔진 및 세션 생성
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False
)
Base = declarative_base()
