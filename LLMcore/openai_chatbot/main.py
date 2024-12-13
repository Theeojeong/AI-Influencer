import streamlit as st
from streamlit_extras.switch_page_button import switch_page

# 메인 화면 설정
st.title("Streamlit Multi-Page Application")

st.write("""
Welcome to the multi-page LLM application!
Use the sidebar to navigate between different pages.
""")


# Main Page
st.title("Main Page")
st.write("Welcome to the Main Page! Use the buttons below to navigate.")

# 버튼으로 페이지 이동
if st.button("Go to Page 1"):
    switch_page("connection_test")

if st.button("Go to Page 2"):
    switch_page("llm_model")