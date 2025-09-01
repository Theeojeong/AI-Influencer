from fastapi import APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import Optional, List
from pydantic import BaseModel
import os
import json
from datetime import datetime
from threading import Lock

from app.schemas.blog import (
    CommentCreate,
    CommentDelete,
    CommentResponse,
)


router = APIRouter(prefix="/blog", tags=["Blog (Mock)"])

_HERE = os.path.dirname(os.path.abspath(__file__))
_DATA_DIR = os.path.abspath(os.path.join(_HERE, "../mock_data"))
_POSTS_FILE = os.path.join(_DATA_DIR, "blog_posts.json")
_COMMENTS_FILE = os.path.join(_DATA_DIR, "comments.json")

_lock = Lock()


def _ensure_data_dir():
    os.makedirs(_DATA_DIR, exist_ok=True)
    if not os.path.exists(_POSTS_FILE):
        with open(_POSTS_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)
    if not os.path.exists(_COMMENTS_FILE):
        with open(_COMMENTS_FILE, "w", encoding="utf-8") as f:
            json.dump([], f, ensure_ascii=False, indent=2)


def _load_posts() -> list:
    _ensure_data_dir()
    with open(_POSTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_posts(data: list) -> None:
    with open(_POSTS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def _load_comments() -> list:
    _ensure_data_dir()
    with open(_COMMENTS_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


def _save_comments(data: list) -> None:
    with open(_COMMENTS_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


@router.get("/", summary="블로그 전체 불러오기 (Mock)")
async def get_blog_data():
    with _lock:
        posts = _load_posts()
        # 최신순 정렬
        posts_sorted = sorted(posts, key=lambda x: x.get("created_at", ""), reverse=True)
        return posts_sorted


@router.post("/add", summary="블로그 글 생성 (Mock)")
async def create_blog(
    title: str = Form(...),
    content: str = Form(...),
    product_id: int = Form(1),
    is_ad: int = Form(0),
    image: Optional[UploadFile] = File(None),
):
    with _lock:
        posts = _load_posts()
        new_id = (max([p.get("post_id", 0) for p in posts]) + 1) if posts else 1
        now = datetime.utcnow().isoformat()
        post = {
            "post_id": new_id,
            "title": title,
            "content": content,
            "product_id": int(product_id),
            "is_ad": int(is_ad),
            "image": None,  # 이미지 업로드는 모드 상 무시/보류
            "created_at": now,
            "views": 0,
            "likes": 0,
            "comments_count": 0,
        }
        posts.append(post)
        _save_posts(posts)
        return {"message": "Blog post created (mock)", "post_id": new_id}


@router.get("/{post_id}", summary="블로그 상세 불러오기 (Mock)")
async def get_blog_detail(post_id: int):
    with _lock:
        posts = _load_posts()
        for p in posts:
            if int(p.get("post_id")) == int(post_id):
                p["views"] = int(p.get("views", 0)) + 1
                _save_posts(posts)
                return p
        raise HTTPException(status_code=404, detail="Post not found")


@router.delete("/{post_id}", summary="블로그 글 삭제 (Mock)")
async def delete_blog(post_id: int):
    with _lock:
        posts = _load_posts()
        new_posts = [p for p in posts if int(p.get("post_id")) != int(post_id)]
        if len(new_posts) == len(posts):
            raise HTTPException(status_code=404, detail="Post not found")
        _save_posts(new_posts)
        # 댓글도 정리
        comments = _load_comments()
        comments = [c for c in comments if int(c.get("post_id")) != int(post_id)]
        _save_comments(comments)
        return {"message": "Deleted (mock)"}


@router.post("/{post_id}/like", summary="좋아요 (Mock)")
async def add_like(post_id: int):
    with _lock:
        posts = _load_posts()
        for p in posts:
            if int(p.get("post_id")) == int(post_id):
                p["likes"] = int(p.get("likes", 0)) + 1
                _save_posts(posts)
                return {"message": "liked", "post_id": post_id, "likes": p["likes"]}
        raise HTTPException(status_code=404, detail="Post not found")


@router.get("/{post_id}/comments_count", summary="댓글 수 (Mock)")
async def get_comments_count(post_id: int):
    with _lock:
        comments = _load_comments()
        n = sum(1 for c in comments if int(c.get("post_id")) == int(post_id))
        return {"post_id": post_id, "comments_count": n}


@router.post("/comments", summary="댓글 생성 (Mock)", response_model=CommentResponse)
async def create_comment(comment: CommentCreate):
    with _lock:
        comments = _load_comments()
        new_id = (max([c.get("comment_id", 0) for c in comments]) + 1) if comments else 1
        entry = {
            "comment_id": new_id,
            "post_id": int(comment.post_id),
            "comment_name": comment.comment_name,
            "comment_content": comment.comment_content,
        }
        comments.append(entry)
        _save_comments(comments)
        # post의 comments_count 증가
        posts = _load_posts()
        for p in posts:
            if int(p.get("post_id")) == int(comment.post_id):
                p["comments_count"] = int(p.get("comments_count", 0)) + 1
        _save_posts(posts)
        return entry


@router.get("/comments/{post_id}", summary="댓글 조회 (Mock)", response_model=List[CommentResponse])
async def get_comments(post_id: int):
    with _lock:
        comments = _load_comments()
        result = [
            {
                "comment_id": c.get("comment_id"),
                "post_id": c.get("post_id"),
                "comment_name": c.get("comment_name"),
                "comment_content": c.get("comment_content"),
            }
            for c in comments
            if int(c.get("post_id")) == int(post_id)
        ]
        return result


@router.delete("/comments/{post_id}", summary="댓글 삭제 (Mock)")
async def delete_comment(comment: CommentDelete, post_id: int):
    with _lock:
        comments = _load_comments()
        before = len(comments)
        comments = [
            c
            for c in comments
            if not (
                int(c.get("post_id")) == int(comment.post_id)
                and c.get("comment_name") == comment.comment_name
            )
        ]
        _save_comments(comments)
        if len(comments) == before:
            raise HTTPException(status_code=404, detail="Comment not found")
        # post의 comments_count 감소
        posts = _load_posts()
        for p in posts:
            if int(p.get("post_id")) == int(comment.post_id):
                p["comments_count"] = max(0, int(p.get("comments_count", 0)) - 1)
        _save_posts(posts)
        return {"message": "deleted"}

