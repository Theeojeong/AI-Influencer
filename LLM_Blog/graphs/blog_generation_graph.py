from typing import TypedDict, List, Tuple

from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_community.document_loaders import UnstructuredURLLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS

from utils.google_utils import google_search
from chains.embedding_chain import update_embedding_cache
from chains.outline_chain import create_outline_with_additional_info
from chains.content_chain import generate_blog_content
from dotenv import load_dotenv
import os
load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
GOOGLE_CSE_ID = os.getenv("GOOGLE_CSE_ID")


def _format_docs(docs) -> str:
    return "\n\n".join(getattr(d, "page_content", str(d)) for d in docs)


class BlogState(TypedDict):
    product_name: str
    product_specs_list: List[str]
    blog_title: str
    keywords: List[str]
    used_urls: List[str]
    specs_info_list: List[Tuple[str, str | None, str | None]]  # (spec, db_info, web_info)
    outline: str
    combined_info: str
    content: str


def _search_and_retrieve(state: BlogState) -> BlogState:
    """For each spec, search web, build a tiny RAG, and summarize details."""
    llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.2)
    embeddings = OpenAIEmbeddings(model="text-embedding-3-small")

    used_urls: List[str] = []
    specs_info_list: List[Tuple[str, str | None, str | None]] = []

    for spec in state.get("product_specs_list", []):
        query = f"{spec} 상세 스펙"
        search_results = google_search(query, num=3, google_api_key=GOOGLE_API_KEY, google_cse_id=GOOGLE_CSE_ID)
        if not search_results:
            web_summary = "웹 검색 결과를 찾지 못했습니다."
            specs_info_list.append((spec, None, web_summary))
            continue

        urls = [item.get("link") for item in search_results[:5] if item.get("link")]
        used_urls.extend(urls)

        loader = UnstructuredURLLoader(urls=urls)
        docs = loader.load()
        if not docs:
            web_summary = "웹 문서에서 추가 정보를 찾지 못했습니다."
            specs_info_list.append((spec, None, web_summary))
            continue

        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        split_docs = splitter.split_documents(docs)
        if not split_docs:
            web_summary = "문서를 분할하지 못했습니다. 원문을 확인해 주세요."
            specs_info_list.append((spec, None, web_summary))
            continue

        vectorstore = FAISS.from_documents(split_docs, embeddings)
        retriever = vectorstore.as_retriever(search_type="similarity", search_kwargs={"k": 3})

        rag_prompt = ChatPromptTemplate.from_messages(
            [
                (
                    "system",
                    "주어진 컨텍스트만 사용해서 한국어로 간결하고 정확하게 답하세요.",
                ),
                (
                    "human",
                    "질문: {question}\n\n컨텍스트:\n{context}",
                ),
            ]
        )
        rag_chain = (
            {"context": retriever | _format_docs, "question": RunnablePassthrough()}
            | rag_prompt
            | llm
            | StrOutputParser()
        )
        question = f"{spec}의 구체적인 스펙과 특징을 한국어로 요약해 주세요. 실제 수치/규격 중심으로."
        web_summary = rag_chain.invoke(question)

        try:
            update_embedding_cache(spec, web_summary)
        except Exception:
            pass

        specs_info_list.append((spec, None, web_summary))

    new_state = dict(state)
    new_state["used_urls"] = used_urls
    new_state["specs_info_list"] = specs_info_list
    return new_state


def _create_outline(state: BlogState) -> BlogState:
    outline, combined = create_outline_with_additional_info(
        state["product_name"], state.get("specs_info_list", []), state["blog_title"], state.get("keywords", [])
    )
    new_state = dict(state)
    new_state["outline"] = outline
    new_state["combined_info"] = combined
    return new_state


def _generate_content(state: BlogState) -> BlogState:
    content = generate_blog_content(
        state.get("outline", ""),
        state["blog_title"],
        state.get("keywords", []),
        state["product_name"],
    )
    new_state = dict(state)
    new_state["content"] = content
    return new_state


def _build_graph():
    graph = StateGraph(BlogState)
    graph.add_node("search_and_retrieve", _search_and_retrieve)
    graph.add_node("create_outline", _create_outline)
    graph.add_node("generate_content", _generate_content)

    graph.set_entry_point("search_and_retrieve")
    graph.add_edge("search_and_retrieve", "create_outline")
    graph.add_edge("create_outline", "generate_content")
    graph.add_edge("generate_content", END)
    return graph.compile()


def blog_generation_workflow(product_name, product_specs_list, blog_title, keywords):
    app = _build_graph()
    initial_state: BlogState = {
        "product_name": product_name,
        "product_specs_list": list(product_specs_list or []),
        "blog_title": blog_title,
        "keywords": list(keywords or []),
        "used_urls": [],
        "specs_info_list": [],
        "outline": "",
        "combined_info": "",
        "content": "",
    }
    final = app.invoke(initial_state)
    return final.get("content", ""), final.get("used_urls", [])

