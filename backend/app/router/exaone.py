from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.schemas.exaone import GenerateRequest
from app.services.exaone_service import generate_stream


router = APIRouter(prefix="/exaone", tags=["exaone"])


@router.post("/generate", summary="OpenAI 스트리밍 응답")
async def generate_streaming(request: GenerateRequest):
    """OpenAI Chat 모델의 스트리밍 응답을 반환합니다."""
    payload = {"model": request.model, "prompt": request.prompt}
    return StreamingResponse(generate_stream(payload), media_type="text/plain")

