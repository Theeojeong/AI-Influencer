import React, { useState } from "react";

import ProfileSideCard from "../components/profile/ProfileSideCard";
import "@fontsource/lexend-deca"; // npm에서 제공하는 경우
import dailyEddy1 from "../assets/img/dailyEddy1.png"
import techEddy from "../assets/img/techEddy.png"
const Profile = () => {
    const [showSideCard, setShowSideCard] = useState(true);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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
    
}

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
    profileHeader: {
        fontFamily: "'Lexend Deca', sans-serif",
        fontSize: "2rem",
        background: "linear-gradient(90deg, #3F201F 0%, #724A38 10%, #8C5F45 20%, #FFEFB8 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "5px",
    },
    headerLine: {
        height: "3px",
        width: "100%",
        background: "linear-gradient(90deg, #3F201F 0%, #724A38 10%, #8C5F45 20%, #FFEFB8 100%)",
        marginBottom: "20px",
    },
    card: {
        background: "#FFFDF7",
        borderRadius: "10px",
        marginBottom: "30px",
        height: "40%",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
        display: "flex", // 이미지와 텍스트 영역을 가로로 정렬
        justifyContent: "flex-start",
        alignItems: "center", // 세로 중앙 정렬
        padding: "10px", // 내부 여백 추가
    },
    dailyimage: {
        width: "20%",
        height: "80%",
        borderRadius: "100px",
        margin: "30px",
    },
    textContainer: {
        display: "flex",
        flexDirection: "column", // 위아래로 정렬
        justifyContent: "center", // 세로 중앙 정렬
        flex: 1, // 이미지 외 나머지 공간 차지
        padding: "10px", // 텍스트 컨테이너 내부 여백
    },
    textContainerRight: {
        display: "flex",
        flexDirection: "column", // 위아래로 정렬
        justifyContent: "center", // 세로 중앙 정렬
        flex: 1,
        padding: "10px",
        textAlign: "right", // 텍스트 오른쪽 정렬
    },
    title: {
        fontSize: "1.1rem",
        marginBottom: "10px", // 설명과 간격
        fontWeight: "bold", // 제목 강조
    },
    description: {
        fontSize: "0.9rem",
        color: "#555", // 설명 텍스트 색상
    },
};

export default Profile