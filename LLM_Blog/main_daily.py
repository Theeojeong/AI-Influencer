import os
import html
import openai
import streamlit as st
from dotenv import load_dotenv

from streamlit_tags import st_tags
# from streamlit_modal import Modal  # 제거: st.dialog 사용

from graphs.blog_generation_graph import blog_generation_workflow
from utils.ai_utils import get_ai_suggested_titles
from utils.db_utils import get_connection


# .env 파일 로드
load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    st.error("OPENAI_API_KEY가 설정되어 있지 않습니다. .env 파일을 확인하세요.")
    st.stop()
openai.api_key = OPENAI_API_KEY  # .env에 담긴 OPENAI_API_KEY 사용

st.set_page_config(layout="wide")

# AI 추천 제목 관련 상태 관리
if "suggested_titles" not in st.session_state:
    st.session_state["suggested_titles"] = []
if "show_ai_modal" not in st.session_state:
    st.session_state["show_ai_modal"] = False

@st.dialog("AI 추천 블로그 제목")
def show_ai_titles_dialog():
    """AI 추천 제목을 보여주는 다이얼로그"""
    product_name = st.session_state.get("product_name", "")
    
    # 제목이 없으면 생성
    if not st.session_state["suggested_titles"]:
        with st.spinner("제목을 생성 중입니다..."):
            new_titles = get_ai_suggested_titles(product_name, max_suggestions=4)
            if new_titles:
                st.session_state["suggested_titles"] = new_titles
            else:
                st.error("추천 제목을 생성하지 못했습니다.")
                return
    
    st.write("AI가 추천한 블로그 제목들을 아래에서 골라주세요.")
    
    # 라디오 선택
    if st.session_state["suggested_titles"]:
        selected_title = st.radio(
            "제목 선택",
            st.session_state["suggested_titles"],
        )
        
        # 버튼들
        c1, c2, c3 = st.columns([1,1,1])
        with c1:
            if st.button("재생성"):
                with st.spinner("제목을 생성 중입니다..."):
                    new_titles = get_ai_suggested_titles(product_name, max_suggestions=4)
                    if new_titles:
                        st.session_state["suggested_titles"] = new_titles
                        st.rerun()
        with c2:
            if st.button("사용하기"):
                st.session_state["blog_title_widget"] = selected_title
                st.session_state["show_ai_modal"] = False
                st.rerun()
        with c3:
            if st.button("닫기"):
                st.session_state["show_ai_modal"] = False
                st.rerun()

left_col, right_col = st.columns([1,2])

with left_col:
    st.title("🦊에디's 블로그 글")

    # 제품명 저장을 위해 세션에 product_name 키 사용
    if "product_name" not in st.session_state:
        st.session_state["product_name"] = ""
    st.session_state["product_name"] = st.text_input("제품명을 입력하세요:", value=st.session_state["product_name"])

    # blog_title_input 키 사용 → AI가 선택한 제목을 반영 가능
    blog_title = st.text_input(
        "블로그 제목을 입력하세요:",
        key="blog_title_widget",
        placeholder="ex) 삼성전자 갤럭시 Z 플립4 사용후기"
    )

    if st.button("AI 추천 제목"):
        product_name = st.session_state.get("product_name", "")
        if not product_name:
            st.warning("제품명을 먼저 입력해주세요.")
        else:
            # 새로 열 때마다 이전 제목 초기화 (선택사항)
            st.session_state["suggested_titles"] = []
            st.session_state["show_ai_modal"] = True


    product_specs_list = st_tags(
        label='제품 스펙',
        text='스펙 입력 후 엔터/스페이스',
        value=[],
        suggestions=[],
        maxtags=6,
        key='spec_tags'
    )


    keywords_list = st_tags(
        label='키워드를 입력하세요(최대10개)',
        text='키워드 입력 후 엔터/스페이스',
        value=[],
        suggestions=[],
        maxtags=10,
        key='keyword_tags'
    )


    # "글 생성" 버튼 -> DB 저장용 최종값
    if st.button("글 생성"):
        final_title = st.session_state["blog_title_widget"]
        if not final_title:
            st.warning("블로그 제목을 입력하거나 AI 추천 제목을 사용해주세요.")
        else:
            with st.spinner("블로그 글을 생성 중입니다... 잠시만 기다려주세요."):
                result, used_urls = blog_generation_workflow(
                    st.session_state["product_name"],
                    product_specs_list,
                    final_title,
                    keywords_list
                )
            if result:
                st.session_state["original_result"] = result
                st.session_state["used_urls"] = used_urls
            else:
                st.warning("글 생성에 실패했습니다.")

# 다이얼로그 표시
if st.session_state["show_ai_modal"]:
    show_ai_titles_dialog()


with right_col:
    with st.container():
        # 글 생성 결과 확인
        if "original_result" not in st.session_state:
            st.markdown(
                "<p style='color: #333; font-size:16px;'>아직 생성된 글이 없습니다. 왼쪽에서 '글 생성' 후 확인해주세요.</p>",
                unsafe_allow_html=True
            )
        else:
            # (1) 본문 렌더링
            # 원본 텍스트
            result_text = st.session_state["original_result"]

            # 1) 백틱 제거
            result_text = result_text.replace("```", "")

            # 2) 혹시 &lt;div&gt;처럼 이스케이프되어 있다면 해제
            result_text = html.unescape(result_text)

            # 글자 수 계산
            char_count = len(result_text)
            byte_count = len(result_text.encode("utf-8"))
            no_space_count = len(result_text.replace(" ", "").replace("\n", ""))
            no_space_byte = len(result_text.replace(" ", "").replace("\n", "").encode("utf-8"))

            st.markdown(
                f"""
                <p style="color:#333; font-size:14px;">
                (공백 포함 
                <span style="color:#6c63ff;">{char_count}</span> 자 | 
                <span style="font-weight:600;">{byte_count} byte</span>, 
                공백 제외 
                <span style="color:#6c63ff;">{no_space_count}</span> 자 | 
                <span style="font-weight:600;">{no_space_byte} byte</span> )
                </p>
                """,
                unsafe_allow_html=True
            )

            display_source_html = ""
            source_html = ""

            if "used_urls" in st.session_state and st.session_state["used_urls"]:
                source_html += "<h3 style='font-size:14px;'>스펙 정보 출처</h3>"
                for url in st.session_state["used_urls"]:
                    display_source_html += f"<p> - <a href='{url}' target='_blank'>{url}</a></p>"

            # (2) 둥근 모서리 박스
            st.markdown(
                f"""
                <div style="background-color: #fff;
                            border-radius: 10px;  
                            padding: 20px;
                            margin-top: 20px;
                            border: 1px solid #ddd;
                            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                            color: #333;">
                    {result_text}
                    {source_html}
                    {display_source_html}
                </div>
                """,
                unsafe_allow_html=True
            )

            ### [MODIFIED PART] : 이미지 업로드 + 제출하기 버튼 함께 배치
            c_img_uploader, c_submit_btn = st.columns([3,1])
            
            with c_img_uploader:
                uploaded_image = st.file_uploader("상품 이미지를 넣어주세요(선택)", type=["png", "jpg", "jpeg"])

            # (3) DB 저장 버튼

            with c_submit_btn:
                if st.button("제출하기"):

                    title_to_save = st.session_state.get("blog_title_widget", "")
                    if not title_to_save:
                        st.warning("제목이 없습니다. '글 생성'을 먼저 실행해주세요.")
                        st.stop()

                    if uploaded_image is not None:
                        if uploaded_image.size > 5 * 1024 * 1024:  # 5MB 제한
                            st.warning("이미지 용량은 5MB 이하만 가능합니다.")
                            st.stop()
                        image_bytes = uploaded_image.read()
                    else:
                        image_bytes = None

                    try:
                        with get_connection() as connection:
                            with connection.cursor() as cursor:
                                insert_sql = """INSERT INTO blog_posts_1 (title, content, image)
                                                VALUES (%s, %s, %s)"""
                                cursor.execute(insert_sql, (title_to_save, result_text, image_bytes))
                            connection.commit()
                        st.success("성공적으로 제출되었습니다!")
                    except Exception as e:
                        st.error(f"DB 저장 중 오류 발생: {e}")