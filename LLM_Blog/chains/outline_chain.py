from typing import List, Tuple
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from dotenv import load_dotenv
load_dotenv()


def create_outline_with_additional_info(
    product_name: str,
    specs_info_list: List[Tuple[str, str | None, str | None]],
    blog_title: str,
    keywords: List[str],
) -> tuple[str, str]:

    combined_info_parts: List[str] = []
    for spec, db_info, web_info in specs_info_list:
        combined_info_parts.append(
            f"스펙: {spec}\nDB정보:\n{db_info or '-'}\n웹검색정보:\n{web_info or '-'}\n"
        )
    combined_info = "\n".join(combined_info_parts)

    system_msg = (
        "당신은 한국어 블로그 글 기획 전문가입니다. 제공된 제품명, 키워드, "
        "스펙 관련 정보(DB/웹)를 바탕으로 SEO를 고려한 목차(아웃라인)를 작성하세요. "
        "각 항목에는 한 줄 설명을 덧붙이고, 본론 항목은 3~4개 수준으로 작성하세요. "
        "번호를 붙이지 말고 Markdown 헤더로 구조화하세요."
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", system_msg),
            (
                "human",
                (
                    "제품명: {product_name}\n"
                    "블로그 제목: {blog_title}\n"
                    "키워드: {keywords}\n\n"
                    "아래 추가 정보를 충분히 반영해 목차를 생성하세요.\n"
                    "[추가 정보]\n{combined_info}\n"
                ),
            ),
        ]
    )

    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.5)
    chain = prompt | llm | StrOutputParser()

    outline = chain.invoke(
        {
            "product_name": product_name,
            "blog_title": blog_title,
            "keywords": ", ".join(keywords) if isinstance(keywords, list) else str(keywords),
            "combined_info": combined_info,
        }
    )
    return outline, combined_info

