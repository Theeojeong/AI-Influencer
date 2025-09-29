import React, { useMemo, useState } from "react";
import axios from "axios";

const TagInput = ({ label, placeholder, tags, setTags, max = 10 }) => {
  const [value, setValue] = useState("");

  const addTag = (raw) => {
    const t = raw.trim();
    if (!t) return;
    if (tags.includes(t)) return;
    if (tags.length >= max) return;
    setTags([...tags, t]);
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(value);
      setValue("");
    }
  };

  const removeTag = (t) => setTags(tags.filter((x) => x !== t));

  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 600, marginBottom: 6 }}>{label}</div>
      <div style={styles.tagBox}>
        {tags.map((t) => (
          <span key={t} style={styles.tag} onClick={() => removeTag(t)}>
            {t} ✕
          </span>
        ))}
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          style={styles.tagInput}
        />
      </div>
      <div style={styles.hint}>Enter 또는 콤마로 추가 (최대 {max}개)</div>
    </div>
  );
};

const DailyBlog = () => {
  const [productName, setProductName] = useState("");
  const [blogTitle, setBlogTitle] = useState("");
  const [specs, setSpecs] = useState([]);
  const [keywords, setKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggest, setShowSuggest] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [usedUrls, setUsedUrls] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const BASE = useMemo(() => {
    let base = process.env.REACT_APP_SERVER_URL;
    if (!base && typeof window !== "undefined") {
      base = window.location.origin + "/";
    }
    if (!base) base = "/";
    if (!base.endsWith("/")) base += "/";
    return base;
  }, []);

  const counts = useMemo(() => {
    const charCount = content.length;
    const byteCount = new TextEncoder().encode(content).length;
    const noSpace = content.replace(/ |\n/g, "");
    const noSpaceCount = noSpace.length;
    const noSpaceByte = new TextEncoder().encode(noSpace).length;
    return { charCount, byteCount, noSpaceCount, noSpaceByte };
  }, [content]);

  const handleSuggest = async () => {
    if (!productName) {
      alert("제품명을 먼저 입력하세요.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${BASE}blog/ai/suggest_titles`, {
        product_name: productName,
        max: 4,
      });
      setSuggestions(res.data.titles || []);
      setShowSuggest(true);
    } catch (e) {
      console.error("AI 제목 추천 오류:", e);

      // 더 자세한 오류 정보 출력
      let errorMessage = "제목 추천 중 오류가 발생했습니다.";
      if (e.response) {
        console.error("Response data:", e.response.data);
        console.error("Response status:", e.response.status);
        console.error("Response headers:", e.response.headers);
        errorMessage += `\n상태 코드: ${e.response.status}`;
        if (e.response.data && e.response.data.detail) {
          errorMessage += `\n오류 상세: ${e.response.data.detail}`;
        }
      } else if (e.request) {
        console.error("Request:", e.request);
        errorMessage +=
          "\n서버에 연결할 수 없습니다. 백엔드 서버가 실행중인지 확인해주세요.";
      } else {
        console.error("Error:", e.message);
        errorMessage += `\n오류 내용: ${e.message}`;
      }

      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    const titleToUse = blogTitle || selectedTitle;
    if (!titleToUse) {
      alert("블로그 제목을 입력하거나 추천 제목을 선택하세요.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${BASE}blog/ai/generate`, {
        product_name: productName,
        product_specs: specs,
        blog_title: titleToUse,
        keywords: keywords,
      });
      setContent((res.data.content || "").replaceAll("```", ""));
      setUsedUrls(res.data.used_urls || []);
      setBlogTitle(titleToUse);
    } catch (e) {
      console.error(e);
      alert("블로그 생성 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!blogTitle) {
      alert("제목이 없습니다. 먼저 글을 생성하세요.");
      return;
    }
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("title", blogTitle);
      fd.append("content", content);
      fd.append("product_id", "1");
      fd.append("is_ad", "0");
      if (imageFile) fd.append("image", imageFile);
      await axios.post(`${BASE}blog/add`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("성공적으로 제출되었습니다!");
    } catch (e) {
      console.error(e);
      alert("제출 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.left}>
        <h2>🦊에디's 블로그 글</h2>
        <label style={styles.label}>제품명</label>
        <input
          style={styles.input}
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="제품명을 입력하세요"
        />

        <label style={styles.label}>블로그 제목</label>
        <input
          style={styles.input}
          value={blogTitle}
          onChange={(e) => setBlogTitle(e.target.value)}
          placeholder="ex) 삼성전자 갤럭시 Z 플립4 사용후기"
        />

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          <button
            style={styles.button}
            onClick={handleSuggest}
            disabled={loading}
          >
            AI 추천 제목
          </button>
          <button
            style={styles.buttonPrimary}
            onClick={handleGenerate}
            disabled={loading}
          >
            글 생성
          </button>
        </div>

        <TagInput
          label="제품 스펙"
          placeholder="스펙 입력 후 Enter/콤마"
          tags={specs}
          setTags={setSpecs}
          max={6}
        />

        <TagInput
          label="키워드 (최대 10개)"
          placeholder="키워드 입력 후 Enter/콤마"
          tags={keywords}
          setTags={setKeywords}
          max={10}
        />

        {showSuggest && suggestions.length > 0 && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <h3>AI 추천 블로그 제목</h3>
              {suggestions.map((t) => (
                <label key={t} style={styles.radioRow}>
                  <input
                    type="radio"
                    name="title"
                    value={t}
                    onChange={(e) => setSelectedTitle(e.target.value)}
                  />
                  <span style={{ marginLeft: 8 }}>{t}</span>
                </label>
              ))}
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  style={styles.button}
                  onClick={async () => {
                    // 재생성
                    await handleSuggest();
                  }}
                  disabled={loading}
                >
                  재생성
                </button>
                <button
                  style={styles.buttonPrimary}
                  onClick={() => {
                    if (selectedTitle) setBlogTitle(selectedTitle);
                    setShowSuggest(false);
                  }}
                >
                  사용하기
                </button>
                <button
                  style={styles.button}
                  onClick={() => setShowSuggest(false)}
                >
                  닫기
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={styles.right}>
        {content ? (
          <>
            <div style={styles.counts}>
              (공백 포함{" "}
              <span style={{ color: "#6c63ff" }}>{counts.charCount}</span> 자 |
              <span style={{ fontWeight: 600 }}> {counts.byteCount} byte</span>,
              공백 제외
              <span style={{ color: "#6c63ff" }}>
                {" "}
                {counts.noSpaceCount}
              </span>{" "}
              자 |
              <span style={{ fontWeight: 600 }}>
                {" "}
                {counts.noSpaceByte} byte
              </span>
              )
            </div>

            {usedUrls && usedUrls.length > 0 && (
              <div style={{ marginTop: 8 }}>
                <h4 style={{ fontSize: 14, margin: 0 }}>스펙 정보 출처</h4>
                {usedUrls.map((u) => (
                  <p key={u} style={{ margin: 0 }}>
                    -{" "}
                    <a href={u} target="_blank" rel="noreferrer">
                      {u}
                    </a>
                  </p>
                ))}
              </div>
            )}

            <div style={styles.contentBox}>
              <pre style={styles.pre}>{content}</pre>
            </div>

            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 12,
                alignItems: "center",
              }}
            >
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              />
              <button
                style={styles.buttonPrimary}
                onClick={handleSubmit}
                disabled={loading}
              >
                제출하기
              </button>
            </div>
          </>
        ) : (
          <p style={{ color: "#333", fontSize: 16 }}>
            아직 생성된 글이 없습니다. 왼쪽에서 '글 생성' 후 확인해주세요.
          </p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    gap: 24,
    padding: "24px 40px",
    flexWrap: "wrap",
  },
  left: { flex: 1, minWidth: 280 },
  right: { flex: 2, minWidth: 320 },
  label: { display: "block", fontWeight: 600, marginBottom: 6 },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: 6,
    marginBottom: 12,
    boxSizing: "border-box",
  },
  button: {
    padding: "10px 14px",
    background: "#fffaea",
    border: "1px solid #f5e4ae",
    borderRadius: 6,
    cursor: "pointer",
  },
  buttonPrimary: {
    padding: "10px 14px",
    background: "#6c63ff",
    color: "#fff",
    border: "1px solid #6c63ff",
    borderRadius: 6,
    cursor: "pointer",
  },
  contentBox: {
    background: "#fff",
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
    border: "1px solid #ddd",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    color: "#333",
    whiteSpace: "pre-wrap",
  },
  pre: { margin: 0, fontFamily: "inherit" },
  counts: { color: "#333", fontSize: 14 },
  tagBox: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    border: "1px solid #ddd",
    borderRadius: 6,
    padding: 8,
    background: "#fff",
  },
  tag: {
    background: "#f0f0ff",
    color: "#333",
    border: "1px solid #dcdcff",
    borderRadius: 12,
    padding: "4px 8px",
    cursor: "pointer",
    userSelect: "none",
  },
  tagInput: {
    flex: 1,
    minWidth: 120,
    border: "none",
    outline: "none",
    padding: 6,
  },
  hint: { fontSize: 12, color: "#666", marginTop: 4 },
  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.3)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modalContent: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    minWidth: 300,
    maxWidth: 520,
  },
  radioRow: { display: "flex", alignItems: "center", margin: "6px 0" },
};

export default DailyBlog;
