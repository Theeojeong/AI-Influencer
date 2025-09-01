import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const TopNav = () => {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [hoveredLogo, setHoveredLogo] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getFontSize = (baseSize) => {
    if (windowWidth < 480) return baseSize * 0.7;
    if (windowWidth < 768) return baseSize * 0.85;
    return baseSize;
  };

  const getGap = () => (windowWidth < 768 ? "20px" : "80px");
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div style={styles.container} className="sticky-header">
      <div style={styles.navbar}>
        <div style={styles.navbarContent}>
          {/* Logo */}
          <Link
            to="/"
            style={{
              ...styles.logo,
              fontSize: `${getFontSize(2)}rem`,
              ...(hoveredLogo ? styles.logoHover : {}),
            }}
            onMouseEnter={() => setHoveredLogo(true)}
            onMouseLeave={() => setHoveredLogo(false)}
          >
            eXflu;
          </Link>

          {/* Mobile menu button */}
          {windowWidth < 768 && (
            <button
              onClick={toggleMenu}
              style={styles.hamburger}
              aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={isMenuOpen}
            >
              ☰
            </button>
          )}

          {/* Navigation links */}
          {(windowWidth >= 768 || isMenuOpen) && (
            <nav
              style={{
                ...styles.navLinks,
                flexDirection: windowWidth < 768 ? "column" : "row",
                gap: getGap(),
                position: windowWidth < 768 ? "absolute" : "static",
                top: windowWidth < 768 ? "70px" : undefined,
                right: windowWidth < 768 ? "10px" : undefined,
                backgroundColor: windowWidth < 768 ? "#fffaea" : "transparent",
                padding: windowWidth < 768 ? "10px" : undefined,
                boxShadow: windowWidth < 768 ? "0 4px 8px rgba(0,0,0,0.1)" : "none",
                borderRadius: windowWidth < 768 ? "5px" : undefined,
                zIndex: 1000,
                justifyContent: windowWidth >= 768 ? "center" : "flex-start",
              }}
              aria-label="주요 메뉴"
            >
              {["profile", "blog", "daily", "contact"].map((text) => (
                <Link
                  key={text}
                  to={`/${text}`}
                  style={{
                    ...styles.link,
                    fontSize: `${getFontSize(1.2)}rem`,
                    ...(hoveredLink === text ? styles.linkHover : {}),
                  }}
                  onMouseEnter={() => setHoveredLink(text)}
                  onMouseLeave={() => setHoveredLink(null)}
                >
                  {text}
                </Link>
              ))}
              <a
                href="https://www.instagram.com/exflu.adi/?igsh=YXhyZzQ0NzdycDZ6"
                target="_blank"
                rel="noopener noreferrer"
                style={styles.icon}
                aria-label="Instagram"
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/30/000000/instagram-new.png"
                  alt="Instagram"
                  style={{
                    width: `${getFontSize(2.2)}rem`,
                    height: `${getFontSize(2.2)}rem`,
                  }}
                />
              </a>
            </nav>
          )}
        </div>
        <div style={styles.contentLine} />
      </div>
    </div>
  );
};

const styles = {
  container: { width: "100%" },
  navbar: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "rgba(255, 250, 234, 0.9)",
    padding: "5px 0",
    width: "100%",
    boxSizing: "border-box",
    position: "relative",
  },
  navbarContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "95%",
    boxSizing: "border-box",
    flexWrap: "wrap",
  },
  contentLine: {
    width: "95%",
    height: "1.5px",
    backgroundColor: "var(--color-primary-200)",
    boxShadow: "0px 2px 15px rgba(212,165,98,0.9), 0px 4px 30px rgba(212,165,98,0.7)",
    position: "absolute",
    bottom: 0,
  },
  logo: {
    fontSize: "2rem",
    fontWeight: "bold",
    textDecoration: "none",
    color: "#000",
    transition: "all 0.3s ease-in-out",
    background: "linear-gradient(to bottom, #3F201F, #A57451)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  logoHover: { fontSize: "2.4rem" },
  navLinks: { display: "flex", alignItems: "center" },
  link: {
    textDecoration: "none",
    color: "#000",
    padding: 5,
    fontSize: "1.2rem",
    transition: "all 0.3s ease-in-out",
  },
  linkHover: { fontSize: "1.4rem", color: "var(--color-primary)", fontWeight: "bold" },
  icon: { display: "flex", alignItems: "center", transition: "all 0.3s ease-in-out" },
  hamburger: {
    fontSize: "1.5rem",
    background: "var(--color-surface)",
    border: "1px solid var(--color-primary-200)",
    borderRadius: "8px",
    cursor: "pointer",
    padding: "6px 10px",
    boxShadow: "var(--shadow-sm)",
  },
};

export default TopNav;

