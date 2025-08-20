from openai import OpenAI
from LLM_Blog.config import OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)


def _parse_title_lines(text: str) -> list[str]:
    lines = [l.strip() for l in text.split("\n") if l.strip()]
    cleaned = []
    for t in lines:
        # Remove leading bullets/numbers/quotes
        t = t.lstrip("-•*0123456789. ").strip().strip('"').strip("'")
        if t:
            cleaned.append(t)
    return cleaned


def get_ai_suggested_titles(product_name, max_suggestions=4):
    """
    GPT에게 블로그 제목을 여러 개 추천해달라고 요청하는 함수.
    기본 모델은 gpt-4o-mini (대부분 계정에서 사용 가능).
    """
    prompt = (
        "당신은 블로그 제목 전문가입니다.\n"
        f"'{product_name}'을 광고하고 클릭을 유도하는 블로그 글 제목을 {max_suggestions}개 추천해줘.\n"
        "제목만 한 줄에 하나씩 출력하고, 번호/따옴표/불릿은 제거해줘."
    )
    try:
        # Prefer Chat Completions with widely available model
        response = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.8,
        )
        ai_text = response.choices[0].message.content.strip()
        titles = _parse_title_lines(ai_text)
        return titles[:max_suggestions]
    except Exception:
        # Fallback: try Responses API (if available on account)
        try:
            resp = client.responses.create(
                model="gpt-4o-mini",
                input=prompt,
            )
            ai_text = resp.output_text.strip()
            titles = _parse_title_lines(ai_text)
            return titles[:max_suggestions]
        except Exception:
            # Legacy SDK fallback
            try:
                import openai as openai_legacy  # type: ignore

                openai_legacy.api_key = OPENAI_API_KEY
                out = openai_legacy.ChatCompletion.create(
                    model="gpt-3.5-turbo",
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.8,
                )
                ai_text = out["choices"][0]["message"]["content"].strip()
                titles = _parse_title_lines(ai_text)
                return titles[:max_suggestions]
            except Exception as e2:
                print(f"Title suggestion failed: {e2}")
                return []



# prompt = f"""
# 당신은 블로그 제목을 짓는 전문가입니다.
# '{product_name}'을 광고하는 블로그 글 제목을 {max_suggestions}개 추천해줘.
# 순수하게 제목만 남겨줘. 번호와 따옴표도 제거해줘.
# """
