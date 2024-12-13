import React, { useState, useEffect } from "react";
import axios from "axios";
import ProfileSideCard from "../components/profile/ProfileSideCard";
import "@fontsource/lexend-deca"; // npm에서 제공하는 경우
import dailyEddy1 from "../assets/img/dailyEddy1.png";
import techEddy from "../assets/img/techEddy.png";

const Profile = () => {
    const [showSideCard, setShowSideCard] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
   
    useEffect(() => {
        const handleResize = () => {
            setShowSideCard(window.innerWidth > 1000);
            setIsMobile(window.innerWidth <= 768);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
   

    return (
        <div
            style={{
                ...styles.container,
                marginLeft: showSideCard ? "45px" : "0", // SideNav가 없으면 marginLeft를 0으로 설정
            }}
        >
            {/* Side Card UI */}
            {showSideCard && <ProfileSideCard />}

            <div style={styles.Profile}>
                <div style={styles.card}>
                    <img src={dailyEddy1} alt="" style={styles.dailyimage} />
                    <div style={styles.textContainer}>
                        <div style={styles.title}>🌳에디의 즐거운 일상🌳</div>
                        <div style={styles.description}>
                            에디의 일상은 항상 행복과 즐거움으로 가득합니다. 🦊
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        ...styles.card,
                        justifyContent: "flex-end", // 이미지와 텍스트 순서 반대
                    }}
                >
                    <div style={styles.textContainerRight}>
                        <div style={styles.title}>🔧발명가 에디🔧</div>
                        <div style={styles.description}>
                            에디는 놀라운 아이디어로 세상을 바꾸는 발명가입니다!
                        </div>
                    </div>
                    <img src={techEddy} alt="" style={styles.dailyimage} />
                </div>

               
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        marginLeft: "45px",
        marginRight: "40px",
        backgroundColor: "#fffaea",
        minHeight: "100vh",
        justifyContent: "space-between",
    },
    Profile: {
        flex: "2.5",
        marginTop: "30px",
        marginLeft: "40px",
        overflow: "auto",
    },
    card: {
        background: "#FFFDF7",
        borderRadius: "10px",
        marginBottom: "30px",
        height: "40%",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "10px",
    },
    dailyimage: {
        width: "20%",
        height: "80%",
        borderRadius: "100px",
        margin: "30px",
    },
    textContainer: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        padding: "10px",
    },
    textContainerRight: {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        flex: 1,
        padding: "10px",
        textAlign: "right",
    },
    title: {
        fontSize: "1.1rem",
        marginBottom: "10px",
        fontWeight: "bold",
    },
    description: {
        fontSize: "0.9rem",
        color: "#555",
    },
    formContainer: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        marginTop: "20px",
    },
    label: {
        fontSize: "1rem",
        fontWeight: "bold",
    },
    input: {
        padding: "10px",
        borderRadius: "5px",
        border: "1px solid #ddd",
    },
    submitButton: {
        marginTop: "20px",
        padding: "10px 20px",
        backgroundColor: "#FBE5A2",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
};

export default Profile;
