import React, { useState } from "react";
import { Link } from "react-router-dom";

const TopNav = () => {
    const [hoveredLink, setHoveredLink] = useState(null); // 현재 호버된 링크
    const [hoveredLogo, setHoveredLogo] = useState(false); // 로고 호버 상태
    const [hoveredIcon, setHoveredIcon] = useState(false); // 아이콘 호버 상태

    const handleMouseEnter = (link) => {
        setHoveredLink(link); // 호버된 링크 설정
    };

    const handleMouseLeave = () => {
        setHoveredLink(null); // 호버 해제
    };

    const handleLogoMouseEnter = () => {
        setHoveredLogo(true); // 로고 호버
    };

    const handleLogoMouseLeave = () => {
        setHoveredLogo(false); // 로고 호버 해제
    };

    const handleIconMouseEnter = () => {
        setHoveredIcon(true); // 아이콘 호버
    };

    const handleIconMouseLeave = () => {
        setHoveredIcon(false); // 아이콘 호버 해제
    };

    return (
        <div style={styles.container}>
            {/* 네비게이션 바 */}
            <div style={styles.navbar}>
                <div style={styles.navbarContent}>
                    <Link
                        to="/"
                        style={hoveredLogo ? { ...styles.logo, ...styles.logoHover } : styles.logo}
                        onMouseEnter={handleLogoMouseEnter}
                        onMouseLeave={handleLogoMouseLeave}
                    >
                        eXflu;
                    </Link>
                    <div style={styles.navLinks}>
                        {["profile", "blog", "contact us"].map((text) => (
                            <Link
                                key={text}
                                to={`/${text.replace(/\s/g, "-")}`}
                                style={
                                    hoveredLink === text
                                        ? { ...styles.link, ...styles.linkHover }
                                        : styles.link
                                }
                                onMouseEnter={() => handleMouseEnter(text)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {text}
                            </Link>
                        ))}
                    </div>
                    <a
                        href="https://www.instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={hoveredIcon ? { ...styles.icon, ...styles.iconHover } : styles.icon}
                        onMouseEnter={handleIconMouseEnter}
                        onMouseLeave={handleIconMouseLeave}
                    >
                        <img
                            src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png"
                            alt="Instagram"
                        />
                    </a>
                </div>
                {/* 가로선 */}
                <div style={styles.navbarLine}></div>
            </div>
        </div>
    );
};

const styles = {
    navbar: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#fffaea",
        padding: "10px 0",
        width: "100%",
    },
    navbarContent: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "95%",
        maxWidth: "1600px",
        boxSizing: "border-box",
        paddingBottom: 5,
    },
    navbarLine: {
        width: "95%",
        maxWidth: "1600px",
        height: "2px",
        backgroundColor: "#f5e4ae",
        boxShadow: `
        0px 4px 15px rgba(222, 157, 155, 0.7), 
        0px 8px 30px rgba(222, 157, 155, 0.5)
        `,
        backgroundColor: "#de9d9b",
    },
    logo: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        textDecoration: "none",
        color: "#000",
        transition: "all 0.3s ease-in-out", // 부드러운 전환 효과
    },
    logoHover: {
        fontSize: "2.8rem", // 크기 증가
        textShadow: `
            2px 2px 5px rgba(222, 157, 155, 0.7), 
            0px 0px 10px rgba(222, 157, 155, 0.5)
        `, // 텍스트 그림자
    },
    navLinks: {
        display: "flex",
        gap: "90px",
        alignItems: "center",
    },
    link: {
        textDecoration: "none",
        color: "#000",
        padding: 10,
        fontSize: "1.5rem",
        transition: "all 0.3s ease-in-out", // 애니메이션 효과
    },
    linkHover: {
        fontSize: "1.7rem", // 크기만 증가
        textShadow: `
            2px 2px 5px rgba(222, 157, 155, 0.7), 
            0px 0px 10px rgba(222, 157, 155, 0.5)
        `, // 텍스트 그림자
    },
    icon: {
        display: "flex",
        alignItems: "center",
        transition: "all 0.3s ease-in-out", // 부드러운 전환 효과
    },
    iconHover: {
        transform: "scale(1.2)", // 크기 증가
        filter: "drop-shadow(2px 2px 5px rgba(222, 157, 155, 0.7))", // 그림자 효과
    },
};

export default TopNav;
