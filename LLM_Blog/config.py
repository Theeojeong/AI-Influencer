import os
from dotenv import load_dotenv, find_dotenv
load_dotenv()

# Load .env from repo root if available
_dotenv_path = find_dotenv(usecwd=True)
if _dotenv_path:
    load_dotenv(_dotenv_path, override=True)

# Workspace-relative default path; can override via env EMBEDDING_CACHE_FILE
_BASE_DIR = os.path.dirname(__file__)
EMBEDDING_CACHE_FILE = os.getenv(
    "EMBEDDING_CACHE_FILE",
    os.path.join(_BASE_DIR, "DB_embedding", "DB_embedding.pt"),
)

DB_CONFIG = {
    "host": os.getenv("DB_HOST", "localhost"),
    "user": os.getenv("DB_USER", "root"),
    "password": os.getenv("DB_PASSWORD", ""),
    "db": os.getenv("DB_NAME", ""),
    # Use utf8mb4 for full Unicode support (4-byte chars)
    "charset": "utf8mb4",
}

