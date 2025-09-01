import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SideCard from "../components/board/SideCard";
import Container from "../components/common/Container";
import Spinner from "../components/common/Spinner";
import Toast from "../components/common/Toast";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [showSideCard, setShowSideCard] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}blog/`);
        const sortedPosts = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setPosts(sortedPosts);
        setError("");
      } catch (e) {
        console.error("데이터 가져오기 중 오류 발생:", e);
        setError("게시글을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setShowSideCard(window.innerWidth > 1000);
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const paginatedPosts = posts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(posts.length / pageSize) || 1;

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  return (
    <Container>
      <div style={styles.container}>
        {showSideCard && <SideCard style={styles.sideCard} />}
        <div style={styles.blogList}>
          <div style={styles.blogHeader}>
            <p style={styles.postCount}>📄 목록</p>
            <div style={styles.postHeader}>
              <span style={styles.postNum}>번호</span>
              <span style={styles.postTitle}>글 제목</span>
              <span style={styles.postDate}>작성일</span>
            </div>
          </div>

          {loading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 40 }}>
              <Spinner size={32} />
            </div>
          ) : (
            <div>
              {paginatedPosts.length > 0 ? (
                paginatedPosts.map((post, index) => (
                  <div
                    key={post.post_id}
                    style={{ ...styles.postItem, cursor: "pointer" }}
                    onClick={() => navigate(`/blog/${post.post_id}`)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === "Enter" ? navigate(`/blog/${post.post_id}`) : null)}
                    aria-label={`${post.title} 열기`}
                    className="card"
                  >
                    <span style={styles.postNum}>{index + 1 + (currentPage - 1) * pageSize}</span>
                    <span style={styles.postTitle}>{post.title}</span>
                    <span style={styles.postDate}>{post.created_at?.split("T")[0]}</span>
                  </div>
                ))
              ) : (
                <p style={{ textAlign: "center", color: "var(--color-text-muted)" }}>게시글이 없습니다.</p>
              )}
            </div>
          )}

          <div style={styles.pagination}>
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="btn">
              이전
            </button>
            <span style={{ minWidth: 64, textAlign: "center" }}>
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="btn"
            >
              다음
            </button>
          </div>
        </div>
      </div>
      <Toast message={error} onClose={() => setError("")} />
    </Container>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "280px 1fr",
    alignItems: "start",
    columnGap: "24px",
    minHeight: "calc(100vh - 64px)",
  },
  sideCard: { minHeight: "100vh" },
  blogList: { paddingTop: "30px", paddingBottom: "30px", height: "100%" },
  post: { borderRadius: "10px", overflow: "auto" },
  blogHeader: { borderBottom: "2px solid var(--color-primary-200)", paddingBottom: 10, marginBottom: 0 },
  postCount: { fontSize: "1rem", marginBottom: 5 },
  postHeader: { display: "flex", alignItems: "center", fontSize: "0.9rem", color: "var(--color-text-muted)", marginTop: 5 },
  postNum: { flex: "1", textAlign: "left" },
  postTitle: { flex: "5", textAlign: "left" },
  postDate: { flex: "2", textAlign: "right" },
  postItem: {
    display: "flex",
    justifyContent: "space-between",
    padding: "14px 14px",
    border: "1px solid var(--color-border)",
    marginBottom: 10,
    borderRadius: 10,
    fontSize: "0.95rem",
    background: "var(--color-surface)",
    transition: "transform .1s ease, box-shadow .1s ease",
  },
  pagination: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 0 0",
    marginTop: 40,
    gap: 10,
    marginBottom: 0,
  },
};

export default Blog;

