import React from "react";
import SideCard from "./ContactSidecard";

const YesPage = () => {
    return (
        <div style={styles.container}>
            {/* Side Card UI */}
            <SideCard />

            {/* 질문 폼 */}
            <div style={styles.post}>
                <h1 style={styles.title}>
                    🍪<span style={styles.highlight}>Question</span>🍪
                </h1>
                <form style={styles.form}>
                    {[
                        "어떤 제품군 / 분야를 홍보하고 싶으신가요?",
                        "예상 금액대를 선택해주세요.",
                        "원하고자 하는 인플루언서의 메인 활동 플랫폼을 선택해주세요.",
                        "원하고자 하는 홍보 이벤트를 선택해주세요.",
                        "원하고자 하는 인플루언서의 성별을 입력해주세요.",
                    ].map((question, index) => (
                        <div key={index} style={styles.question}>
                            <label style={styles.label}>{`Q${index + 1}. ${question}`}</label>
                            <input
                                type="text"
                                placeholder="입력하거나 선택해주세요"
                                style={styles.textInput}
                            />
                        </div>
                    ))}
                    <button type="submit" style={styles.submitButton}>
                        등록
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        marginLeft: "45px",
        marginRight: "45px",
        backgroundColor: "#fffaea",
        minHeight: "100vh",
    },
    post: {
        flex: "2.5",
        width: "100%",
        marginTop: "30px",
        marginLeft: "40px",
        marginRight: "40px",
        backgroundColor: "#fffdf7",
        borderRadius: "10px",
        padding: "30px 30px 30px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "30px",
        overflow: "auto",
    },
    title: {
        fontSize: "1.5rem",
        textAlign: "center",
        marginBottom: "20px",
        fontWeight: "bold",
        color: "#6d4c41",
    },
    highlight: {
        color: "#d4a56e",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "15px",
    },
    question: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
    },
    label: {
        fontSize: "1rem",
        color: "#6d4c41",
    },
    textInput: {
        width: "100%",
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        fontSize: "1rem",
    },
    submitButton: {
        marginTop: "20px",
        padding: "10px",
        fontSize: "1.2rem",
        backgroundColor: "#f3e5ab",
        border: "none",
        borderRadius: "5px",
        color: "#6d4c41",
        cursor: "pointer",
        transition: "background 0.3s ease",
    },
};

export default YesPage;
