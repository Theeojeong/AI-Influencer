import React, { useState, useEffect } from "react";
import SideCard from "./ContactSidecard";
import question from "../../assets/img/question.png";
import Snowfall from "react-snowfall";
import "@fontsource/lexend-deca"; // npm에서 제공하는 경우

const Solution = () => {
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
            {showSideCard && <SideCard />}

            {/* solution 내용 UI */}
            <div
                style={{
                    ...styles.post,
                    flex: showSideCard ? "2.5" : "3.5", // SideCard가 없을 때 너비 확장
                    marginLeft : isMobile ? "25px" : "40px",
                    marginRight : isMobile ? "-20px" : "0px",
                    marginTop : isMobile ? "20px" : "30px",
                    padding : isMobile ? "20px 10px 10px" : "30px 30px 30px",
                    marginBottom : isMobile ? "15px" : "30px"
                }}
            >
                {/* solution header */}
                <div style={styles.solutionHeader}>
                    Marketing Solution
                </div>
                <div style={styles.sectionLine}>
                    
                </div>

                {/* solution 내용 */}
                <div>
                    
                </div>
            </div>
        </div>
    );
}

const styles =  {
    container: {
        display: "flex",
        marginLeft: "45px",
        marginRight: "40px",
        backgroundColor: "#fffaea",
        minHeight: "100vh",
        justifyContent: "space-between", // 좌우 요소 간 여백 균일화
    },
    post: {
        flex: "2.5",
        background: "linear-gradient(180deg, #FFEFB8 0%, #FFFDF7 25%)",
        marginTop: "30px",
        marginLeft: "40px",
     
        borderRadius: "10px",
        padding: "30px 30px 30px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        marginBottom: "30px",
        overflow: "auto",
    },
    solutionHeader: {
        fontFamily: "'Lexend Deca', sans-serif",
        fontSize: "2.5rem",
        background: "linear-gradient(90deg, #3F201F 0%, #724A38 10%, #8C5F45 20%, #FFEFB8 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        marginBottom: "0px",
        padding: "10px"
    },
    sectionLine: {
        height: "3px",
        width: "100%",
        background: "linear-gradient(90deg, #3F201F 0%, #724A38 10%, #8C5F45 20%, #FFEFB8 100%)",
        marginBottom: "20px"
    }
}
export default Solution;