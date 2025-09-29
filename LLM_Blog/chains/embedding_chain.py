import os
import torch
from typing import Optional
from langchain_openai import OpenAIEmbeddings
from config import EMBEDDING_CACHE_FILE

from dotenv import load_dotenv
load_dotenv()


def get_openai_embedding(text: str) -> Optional[torch.Tensor]:
    try:
        embed = OpenAIEmbeddings(model="text-embedding-3-small")
        vec = embed.embed_query(text)
        return torch.tensor(vec, device="cpu")
    except Exception as e:
        print(f"임베딩 생성 오류: {e}")
        return None


def update_embedding_cache(model_name: str, information: str | None):
    text = (model_name + " " + information.strip()) if information else model_name
    new_embedding = get_openai_embedding(text)
    if new_embedding is None:
        print(f"'{model_name}' 임베딩 생성 실패. 캐시 업데이트를 건너뜁니다.")
        return

    try:
        if os.path.exists(EMBEDDING_CACHE_FILE):
            embedding_cache = torch.load(EMBEDDING_CACHE_FILE, map_location="cpu")
            if not isinstance(embedding_cache, dict):
                embedding_cache = {}
        else:
            embedding_cache = {}
        embedding_cache[model_name] = new_embedding
        os.makedirs(os.path.dirname(EMBEDDING_CACHE_FILE), exist_ok=True)
        torch.save(embedding_cache, EMBEDDING_CACHE_FILE)
        print(f"'{model_name}' 임베딩 캐시 업데이트 완료.")
    except Exception as e:
        print(f"임베딩 캐시 저장 오류: {e}")

