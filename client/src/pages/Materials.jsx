import { useEffect, useState } from "react";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [feedbackModal, setFeedbackModal] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState("");

  const load = async (search = "") => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/materials${search ? `?q=${encodeURIComponent(search)}` : ""}`,
      );
      if (res.ok) {
        const data = await res.json();
        setMaterials(Array.isArray(data) ? data : []);
      }
    } catch {
      // silently handle network error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load(q);
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    if (!feedbackModal) return;
    setFeedbackStatus("submitting");

    const token =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("token")
        : null;

    if (!token) {
      setFeedbackStatus("Please log in to submit feedback.");
      return;
    }

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetId: feedbackModal._id,
          targetType: "material",
          rating: Number(rating),
          comment,
        }),
      });

      if (res.ok) {
        setFeedbackStatus("Thank you for your feedback!");
        setTimeout(() => {
          setFeedbackModal(null);
          setFeedbackStatus("");
          setComment("");
        }, 1500);
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedbackStatus(err.error || "Failed to submit feedback.");
      }
    } catch {
      setFeedbackStatus("Network error submitting feedback.");
    }
  };

  const subjects = [
    "all",
    ...Array.from(new Set(materials.map((m) => m.subject).filter(Boolean))),
  ];
  const filteredMaterials =
    selectedSubject === "all"
      ? materials
      : materials.filter((m) => m.subject === selectedSubject);

  return (
    <div className="container page fade-in">
      {/* Header section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2>Study materials</h2>
          <p>
            Browse, search, and download student-curated study guides, lecture
            notes, and slides.
          </p>
        </div>

        <a
          href="/materials/upload"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            background: "var(--color-primary)",
            color: "#fff",
            borderRadius: "var(--radius-md)",
            fontWeight: 600,
            fontSize: "0.875rem",
            textDecoration: "none",
            boxShadow: "var(--shadow-sm)",
          }}
        >
          <span>📤</span> Upload Material
        </a>
      </div>

      {/* Search & Filter Toolbar */}
      <div
        className="card card-body"
        style={{
          padding: "1.25rem",
          marginBottom: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <form
          onSubmit={onSearch}
          style={{
            display: "flex",
            gap: "0.75rem",
            width: "100%",
          }}
        >
          <div style={{ position: "relative", flex: 1 }}>
            <span
              style={{
                position: "absolute",
                left: "0.85rem",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--color-gray-400)",
                fontSize: "1rem",
              }}
            >
              🔍
            </span>
            <input
              placeholder="Search materials"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ paddingLeft: "2.5rem" }}
            />
          </div>
          <button type="submit" style={{ minWidth: "100px" }}>
            Search
          </button>
        </form>

        {/* Subject Filter Chips */}
        {subjects.length > 2 && (
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <span
              style={{
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-gray-500)",
                marginRight: "0.25rem",
              }}
            >
              Filter by Subject:
            </span>
            {subjects.map((subj) => (
              <button
                key={subj}
                type="button"
                onClick={() => setSelectedSubject(subj)}
                style={{
                  padding: "0.25rem 0.75rem",
                  fontSize: "0.8125rem",
                  borderRadius: "var(--radius-full)",
                  border: "1px solid",
                  borderColor:
                    selectedSubject === subj
                      ? "var(--color-primary)"
                      : "var(--color-gray-300)",
                  background:
                    selectedSubject === subj
                      ? "var(--color-primary-light)"
                      : "#fff",
                  color:
                    selectedSubject === subj
                      ? "var(--color-primary)"
                      : "var(--color-gray-600)",
                  fontWeight: selectedSubject === subj ? 600 : 500,
                  cursor: "pointer",
                }}
              >
                {subj === "all" ? "All Subjects" : subj}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Materials List / Grid */}
      {loading ? (
        <div className="loading-page" style={{ minHeight: "30vh" }}>
          <span className="spinner"></span>
          <p>Loading study materials...</p>
        </div>
      ) : filteredMaterials.length === 0 ? (
        <div className="card empty-state" style={{ margin: "2rem 0" }}>
          <div className="empty-state-icon">📂</div>
          <p
            style={{
              fontSize: "1.125rem",
              fontWeight: 600,
              color: "var(--color-gray-700)",
              marginBottom: "0.5rem",
            }}
          >
            No materials found.
          </p>
          <p
            style={{
              maxWidth: "380px",
              margin: "0 auto 1.5rem",
              fontSize: "0.875rem",
            }}
          >
            {q
              ? "Try adjusting your search terms or filters."
              : "Be the first one to share notes with fellow students!"}
          </p>
          <a
            href="/materials/upload"
            style={{
              display: "inline-flex",
              padding: "0.5rem 1.25rem",
              background: "var(--color-primary)",
              color: "#fff",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              fontSize: "0.875rem",
              textDecoration: "none",
            }}
          >
            Upload New Material
          </a>
        </div>
      ) : (
        <ul
          style={{
            listStyle: "none",
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {filteredMaterials.map((m) => (
            <li
              key={m._id}
              className="card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "1.25rem",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.75rem",
                    marginBottom: "0.75rem",
                  }}
                >
                  <div
                    style={{
                      width: "2.75rem",
                      height: "2.75rem",
                      borderRadius: "var(--radius-md)",
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "1.35rem",
                      flexShrink: 0,
                    }}
                  >
                    📄
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "var(--color-gray-900)",
                        marginBottom: "0.25rem",
                        lineHeight: 1.3,
                        wordBreak: "break-word",
                      }}
                    >
                      {m.title}
                    </h3>
                    <div
                      style={{
                        display: "flex",
                        gap: "0.4rem",
                        flexWrap: "wrap",
                        marginTop: "0.35rem",
                      }}
                    >
                      <span className="badge badge-subject">{m.subject}</span>
                      <span
                        className="badge"
                        style={{
                          background: "var(--color-gray-100)",
                          color: "var(--color-gray-700)",
                          border: "1px solid var(--color-gray-200)",
                        }}
                      >
                        {m.topic}
                      </span>
                    </div>
                  </div>
                </div>

                {m.description && (
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--color-gray-600)",
                      margin: "0.5rem 0 1rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {m.description}
                  </p>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: "0.75rem",
                  marginTop: "0.75rem",
                  borderTop: "1px solid var(--color-gray-100)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setFeedbackModal(m)}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.75rem",
                    color: "var(--color-gray-500)",
                    cursor: "pointer",
                  }}
                >
                  ⭐ Rate
                </button>

                <a
                  href={`/api/materials/${m._id}/download`}
                  download
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.35rem",
                    padding: "0.45rem 0.85rem",
                    background: "var(--color-primary-light)",
                    color: "var(--color-primary)",
                    borderRadius: "var(--radius-md)",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    textDecoration: "none",
                    transition: "all var(--transition-fast)",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = "var(--color-primary)";
                    e.currentTarget.style.color = "#fff";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background =
                      "var(--color-primary-light)";
                    e.currentTarget.style.color = "var(--color-primary)";
                  }}
                >
                  <span>⬇️</span> download
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Feedback Modal */}
      {feedbackModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            zIndex: 1000,
          }}
        >
          <div
            className="card card-body"
            style={{
              maxWidth: "400px",
              width: "100%",
              background: "#fff",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <h3 style={{ fontSize: "1.125rem", marginBottom: "0.5rem" }}>
              Rate Material: {feedbackModal.title}
            </h3>
            <p
              style={{
                fontSize: "0.8125rem",
                color: "var(--color-gray-500)",
                marginBottom: "1rem",
              }}
            >
              Share your feedback to help peers find the best study resources.
            </p>

            <form
              onSubmit={handleFeedbackSubmit}
              style={{ display: "grid", gap: "0.875rem" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    marginBottom: "0.35rem",
                  }}
                >
                  Rating (1 to 5 stars)
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  style={{ width: "100%" }}
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                  <option value="4">⭐⭐⭐⭐ (4 - Very Good)</option>
                  <option value="3">⭐⭐⭐ (3 - Good)</option>
                  <option value="2">⭐⭐ (2 - Fair)</option>
                  <option value="1">⭐ (1 - Needs Improvement)</option>
                </select>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    marginBottom: "0.35rem",
                  }}
                >
                  Comments (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="What was helpful about this material?"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  style={{ width: "100%", resize: "vertical" }}
                />
              </div>

              {feedbackStatus && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: feedbackStatus.includes("Thank you")
                      ? "var(--color-success)"
                      : "var(--color-danger)",
                    margin: 0,
                  }}
                >
                  {feedbackStatus}
                </p>
              )}

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  justifyContent: "flex-end",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  type="button"
                  className="btn-secondary btn-sm"
                  onClick={() => setFeedbackModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-sm">
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
