import streamlit as st
import requests
from langchain_exaone_api.constant import CHATBOT_ROLE, CHATBOT_MESSAGE
from langchain_exaone_api.prompt import create_message
from langchain_exaone_api.chat import response_from_langgraph
from langchain_exaone_api.utils import init_chatbot
from langchain_exaone_api.ollama_api import fetch_ollama_response, create_ollama_prompt, get_langchain_tools
from langchain_exaone_api.langgraph.agent import create_openai_langgraph_agent
from langchain.agents import initialize_agent, Tool
from streamlit_extras.switch_page_button import switch_page
from langchain.prompts import ChatPromptTemplate
import httpx  # requests 대신 httpx 사용

# 백엔드 URL 설정
BACKEND_URL = "https://backdocsend.jamesmoon.click/blog/add"

# 페이지 타이틀 및 버튼
st.title("Exaone LLM Model")
col1, col2, col3,_ = st.columns([1, 1, 1, 1])

# 버튼으로 페이지 이동
with col1:
    if st.button("Main Page"):
        switch_page("main")
with col2:
    if st.button("DB Data Search"):
        switch_page("DB_Data_Search")
with col3:
    if st.button("OpenAI LLM Model"):
        switch_page("openapi_model")

st.write("LLM model에 적절한 키워드를 입력하세요")

# FastAPI 서버 URL
FASTAPI_URL = "https://backdocsend.jamesmoon.click/exaone/generate"

# Streamlit UI 초기 설정
st.title("🦊 LLM 챗봇")
st.write("FastAPI 서버를 통해 LLM 모델과 대화하는 챗봇입니다.")

# 세션 상태 초기화 (대화 기록 저장)
if "messages" not in st.session_state:
    st.session_state.messages = []

# 기존 메시지 표시
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# 사용자 입력 처리
user_input = st.chat_input("메시지를 입력하세요...")

if user_input:
    # 사용자 메시지 저장
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)
    
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", """
You are AdI, an IT expert and inventor in Porong Porong Village, a cold Antarctic region. Speak in a friendly, casual tone like a close friend.
AdI is a playful inventor, passionate about creating and repairing. You often bicker with Pororo but quickly reconcile, showcasing your intellect while relying on Pororo’s athleticism. Loopy is shy but a great cook, Poby is kind and strong, Crong is young and mischievous, and Harry is loud but cheerful.
Answer IT and engineering questions accurately. For product inquiries, write in a blog format with features, emojis, and AdI’s personality, using informal Korean as if talking to a friend.
Translate names as follows:
AdI - AdI, Porong Porong Village - 뽀롱뽀롱 마을, Pororo - 뽀로로, Loopy - 루피, Poby - 포비, Crong - 크롱, Harry - 헤리
"""),
        ("user", user_input),
    ])
    
    # FastAPI 서버에 요청
    with st.chat_message("assistant"):
        message_placeholder = st.empty()  # 메시지 표시를 위한 자리 잡기
        full_response = ""  # 전체 응답 초기화

        try:
            # FastAPI 서버에 스트리밍 요청
            system_and_user_prompt = prompt_template.format(input=user_input)  # 시스템 메시지 포함 프롬프트 생성
            with httpx.stream("POST", FASTAPI_URL, json={"model": "exaone3.5", "prompt": system_and_user_prompt}) as response:
                if response.status_code == 200:
                    for chunk in response.iter_text():
                        if chunk:  # 빈 텍스트 제외
                            full_response += chunk  # 전체 응답 누적
                            message_placeholder.markdown(full_response + "▌")  # 진행 중 표시
                    message_placeholder.markdown(full_response)  # 완료 시 전체 표시
                else:
                    st.error(f"Error: {response.status_code}")
        except Exception as e:
            st.error(f"FastAPI 서버와 통신 중 오류 발생: {e}")

    # 챗봇 메시지 저장
    st.session_state.messages.append({"role": "assistant", "content": full_response})

st.write("### 결과 저장하기")
with st.expander("결과 저장하기", expanded=False):  # expanded=False로 기본적으로 접힘 상태
    with st.form("save_form"):
        title = st.text_input("제목을 입력하세요", "챗봇 대화 결과")
        product_id = st.number_input("상품 ID", value=1, step=1)
        is_ad = st.selectbox("광고 여부", [0, 1], format_func=lambda x: "아니오" if x == 0 else "예")
        uploaded_image = st.file_uploader("이미지 업로드 (선택)", type=["jpg", "png", "jpeg"])

        submitted = st.form_submit_button("결과 저장")
        if submitted:
            try:
                if st.session_state.messages:
                    # 마지막 챗봇 응답 내용 가져오기
                    last_response = st.session_state.messages[-1]['content'].strip()

                    # multipart/form-data 전송 준비
                    files = {
                        "title": (None, title),
                        "content": (None, last_response),
                        "product_id": (None, str(int(product_id))),
                        "is_ad": (None, str(int(is_ad)))
                    }

                    # 이미지 파일이 있으면 Content-Type을 명시하고 추가
                    if uploaded_image:
                        files["image"] = (uploaded_image.name, uploaded_image.read(), uploaded_image.type)

                    # 백엔드로 POST 요청
                    response = requests.post(BACKEND_URL, files=files)

                    # 응답 처리
                    if response.status_code == 200:
                        response_data = response.json()
                        st.success(f"저장 성공: {response_data.get('message')}, Post ID: {response_data.get('post_id')}")
                    else:
                        st.error(f"저장 실패: {response.status_code}, {response.text}")
                else:
                    st.warning("저장할 챗봇 답변이 없습니다.")
            except Exception as e:
                st.error(f"오류 발생: {e}")
