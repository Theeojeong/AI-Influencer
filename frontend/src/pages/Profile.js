import React, { useState, useEffect } from "react";
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
                <div style={{...styles.card,
                    flexDirection : isMobile ? "column" : "row"
                }}>
                    <img src={dailyEddy1} alt="" style={styles.dailyimage} />
                    <div style={styles.textContainer}>
                        <div style={styles.title}>🌳에디의 즐거운 일상🌳</div>
                        <div style={styles.description}>
                        안녕, 친구들! 오늘도 신나는 하루가 시작됐어!🦊😛 나는 뽀로로, 루피, 크롱, 패티, 포비와 함께 놀면서 기발한 발명품을 만들고 있어. 아침에 일어났더니 갑자기 '자동차 청소 로봇' 아이디어가 떠올라서 로디와 함께 만들었지! 친구들이 다들 좋아해주더라구.

그리고 어제는 뽀로로랑 장난치다가 눈덩이 던지는 기계로 친구들을 놀래켰어. 크롱이랑 패티는 깜짝 놀라서 귀여운 표정을 지었지! 이렇게 매일매일이 즐겁고 신나는 일들로 가득해. 앞으로도 더 많은 발명과 장난으로 친구들과 함께할 거야! 기대해줘!🙌
                        
                        
                        
                        
                        
                        </div>
                    </div>
                </div>

                <div
                    style={{
                        ...styles.card,
                        justifyContent: "flex-end", // 이미지와 텍스트 순서 반대
                        background: "linear-gradient(270deg, #FFEFB8 0%, #FFFDF7 85%)",
                        flexDirection : isMobile ? "column" : "row"
                    }}
                >
                    <div style={styles.textContainerRight}>
                        <div style={styles.title}>🔧발명가 에디🔧</div>
                        <div style={styles.description}>
                        안녕, 친구!😛 요즘 과학의 즐거움에 푹 빠져있어.🔧 내가 발명한 기계들로 친구들을 놀래키는 것도 좋지만, 사실은 과학이 얼마나 재미있는지 더 많은 사람들에게 알려주고 싶어. 과학은 단순히 어려운 공식이나 실험이 아니라, 우리 주변의 모든 것에 숨겨진 신비로운 이야기들이거든!

                        <br></br> <br></br>예를 들어, 내가 만든 로디는 단순한 로봇이 아니라, 친구들이 필요할 때 언제든지 도와줄 수 있는 친구야. 이런 발명품을 통해 과학이 얼마나 유용하고 흥미로운지 보여주고 싶어. 그래서 앞으로도 계속 신기한 기계들을 만들고, 친구들과 함께 과학의 즐거움을 나누고 싶어! 너도 나와 함께 과학의 세계로 떠나볼래?🚀🦊
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
       
        // minHeight: "100vh",
        justifyContent: "space-between",
    },
    Profile: {
        flex: "2.5",
        marginTop: "30px",
        marginLeft: "40px",
        overflow: "auto",
    },
    card: {
        borderRadius: "10px",
        marginBottom: "30px",
        height: "auto",
        boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.1)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        padding: "10px",
        background: "linear-gradient(90deg, #FFEFB8 0%, #FFFDF7 85%)"
    },
    dailyimage: {
        width: "240px",
        height: "240px",
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
