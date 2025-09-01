from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from LLM_Blog.config import OPENAI_API_KEY


def generate_blog_content(outline, blog_title, keywords, product_name, openai_api_key=None):
    """Generate blog content from outline using LCEL and ChatOpenAI."""
    system_msg = (
        "당신은 한국어로 매력적인 광고성 블로그 글을 작성하는 작가입니다. "
        "아래 제공된 목차와 메타 정보를 바탕으로 SEO 요소를 반영해 글을 작성하세요. "
        "번호/불릿을 과도하게 사용하지 말고, 적절한 Markdown 헤더와 문단으로 자연스럽게 구성하세요."
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
                    "[목차]\n{outline}\n\n"
                    "위 목차를 충실히 따르되, 한글로 자연스럽고 설득력 있게 작성하세요."
                ),
            ),
        ]
    )

    llm = ChatOpenAI(model="gpt-4o-mini", api_key=(openai_api_key or OPENAI_API_KEY), temperature=0.8)
    chain = prompt | llm | StrOutputParser()

    generated_content = chain.invoke(
        {
            "outline": outline,
            "blog_title": blog_title,
            "keywords": ", ".join(keywords) if isinstance(keywords, list) else str(keywords),
            "product_name": product_name,
        }
    )
    return generated_content

