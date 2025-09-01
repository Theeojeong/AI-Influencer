from fastapi import HTTPException
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
import logging

logging.basicConfig(level=logging.INFO)


def generate_ollama_exaone_service(payload: dict):
    """
    [Deprecated] 호환성 유지용. OpenAI Chat 모델로 단발 응답을 반환합니다.
    """
    try:
        model = payload.get("model") or "gpt-4o-mini"
        if not str(model).lower().startswith(("gpt-", "o", "text-")):
            model = "gpt-4o-mini"
        prompt = payload.get("prompt") or ""
        llm = ChatOpenAI(model=model, temperature=0.7)
        msg = llm.invoke([HumanMessage(content=prompt)])
        yield getattr(msg, "content", str(msg))
    except Exception as e:
        yield f"{{\"error\": \"{str(e)}\"}}"


async def generate_stream(payload: dict):
    """
    OpenAI Chat 모델을 langchain_openai로 스트리밍 출력합니다.
    FastAPI StreamingResponse에 적합한 순수 텍스트 청크를 yield 합니다.
    """
    try:
        model = payload.get("model") or "gpt-4o-mini"
        if not str(model).lower().startswith(("gpt-", "o", "text-")):
            model = "gpt-4o-mini"
        prompt = payload.get("prompt") or ""
        llm = ChatOpenAI(model=model, temperature=0.7)

        async for chunk in llm.astream([HumanMessage(content=prompt)]):
            text = getattr(chunk, "content", None)
            if text:
                yield text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Streaming failed: {str(e)}")
