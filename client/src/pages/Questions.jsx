import { useEffect, useState } from "react";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [quizModalOpen, setQuizModalOpen] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizTopic, setQuizTopic] = useState("");
  const [quizCreating, setQuizCreating] = useState(false);
  const [quizMsg, setQuizMsg] = useState("");

  const load = async (d = "", q = "") => {
    setLoading(true);
    const token =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("token")
        : null;

    const headers = token ? { Authorization: `Bearer ${token}` } : {};

    const params = new URLSearchParams();
    if (d) params.append("difficulty", d);
    if (q) params.append("q", q);
    const queryStr = params.toString() ? `?${params.toString()}` : "";

    try {
      const res = await fetch(`/api/questions${queryStr}`, { headers });
      if (res.ok) {
        const data = await res.json();
        setQuestions(Array.isArray(data) ? data : []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onFilter = (e) => {
    const val = e.target.value;
    setDifficulty(val);
    load(val, search);
  };

  const onSearch = (e) => {
    e.preventDefault();
    load(difficulty, search);
  };

  const toggleSelect = (id) => {
    setSelectedQuestions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!quizTitle || !quizTopic || selectedQuestions.length === 0) {
      setQuizMsg("Please enter title, topic, and select at least one question.");
      return;
    }

    const token =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("token")
        : null;

    if (!token) {
      setQuizMsg("You must be logged in to create a quiz.");
      return;
    }

    setQuizCreating(true);
    setQuizMsg("");

    try {
      const res = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: quizTitle,
          topic: quizTopic,
          questionIds: selectedQuestions,
        }),
      });

      if (res.ok) {
        const quiz = await res.json();
        setQuizMsg("Quiz created successfully! Launching...");
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = `/quiz/${quiz._id}`;
          }
        }, 1000);
      } else {
        const err = await res.json().catch(() => ({}));
        setQuizMsg(err.error || "Failed to create quiz.");
      }
    } catch {
      setQuizMsg("Network error creating quiz.");
    } finally {
      setQuizCreating(false);
    }
  };

  const getDifficultyBadge = (diff) => {
    switch (diff) {
      case "easy":
        return <span className="badge badge-easy">easy</span>;
      case "hard":
        return <span className="badge badge-hard">hard</span>;
      default:
        return <span className="badge badge-medium">medium</span>;
    }
  };

  return (
    <div className="container page fade-in">
      {/* Top Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "1.75rem",
        }}
      >
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h2>Question bank</h2>
          <p>
            Explore crowd-sourced practice questions, filter by difficulty, or
            create custom quizzes.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {selectedQuestions.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setQuizTopic(
                  questions.find((q) => q._id === selectedQuestions[0])
                    ?.topic || "General"
                );
                setQuizModalOpen(true);
              }}
              style={{
                background: "var(--color-success)",
                color: "#fff",
              }}
            >
              🎯 Start Quiz with Selected ({selectedQuestions.length})
            </button>
          )}

          <a
            href="/questions/new"
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
            <span>➕</span> Add Question
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div
        className="card card-body"
        style={{
          padding: "1.25rem",
          marginBottom: "1.75rem",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <form
          onSubmit={onSearch}
          style={{
            display: "flex",
            gap: "0.5rem",
            flex: "1 1 300px",
          }}
        >
          <input
            placeholder="Search questions by text..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="submit"
            className="btn-secondary"
            style={{ padding: "0.625rem 1rem" }}
          >
            Search
          </button>
        </form>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            flexShrink: 0,
          }}
        >
          <label
            htmlFor="difficulty-filter"
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "var(--color-gray-600)",
            }}
          >
            Difficulty:
          </label>
          <select
            id="difficulty-filter"
            value={difficulty}
            onChange={onFilter}
            aria-label="filter difficulty"
            style={{ minWidth: "130px" }}
          >
            <option value="">all</option>
            <option value="easy">easy</option>
            <option value="medium">medium</option>
            <option value="hard">hard</option>
          </select>
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="loading-page" style={{ minHeight: "30vh" }}>
          <span className="spinner"></span>
          <p>Loading questions...</p>
        </div>
      ) : (
        <>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {questions.map((q) => {
              const isSelected = selectedQuestions.includes(q._id);
              return (
                <li
                  key={q._id}
                  className="card"
                  style={{
                    padding: "1.25rem 1.5rem",
                    border: isSelected
                      ? "2px solid var(--color-primary)"
                      : "1px solid var(--color-gray-200)",
                    background: isSelected
                      ? "var(--color-primary-light)"
                      : "#fff",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1rem",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelect(q._id)}
                      style={{
                        width: "1.15rem",
                        height: "1.15rem",
                        marginTop: "0.25rem",
                        cursor: "pointer",
                      }}
                      title="Select for Quiz"
                    />

                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {q.subject && (
                          <span className="badge badge-subject">
                            {q.subject}
                          </span>
                        )}
                        {q.topic && (
                          <span
                            className="badge"
                            style={{
                              background: "var(--color-gray-100)",
                              color: "var(--color-gray-700)",
                            }}
                          >
                            {q.topic}
                          </span>
                        )}
                        {getDifficultyBadge(q.difficulty)}
                      </div>

                      <div
                        style={{
                          fontSize: "1.05rem",
                          fontWeight: 600,
                          color: "var(--color-gray-900)",
                          marginBottom: "0.75rem",
                          lineHeight: 1.4,
                        }}
                      >
                        {q.text} ({q.topic}, {q.difficulty})
                      </div>

                      {q.options && q.options.length > 0 && (
                        <div
                          style={{
                            display: "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(200px, 1fr))",
                            gap: "0.5rem",
                            marginTop: "0.75rem",
                          }}
                        >
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              style={{
                                padding: "0.5rem 0.75rem",
                                borderRadius: "var(--radius-md)",
                                background: "var(--color-gray-50)",
                                border: "1px solid var(--color-gray-200)",
                                fontSize: "0.875rem",
                                color: "var(--color-gray-700)",
                              }}
                            >
                              <strong
                                style={{
                                  marginRight: "0.35rem",
                                  color: "var(--color-gray-400)",
                                }}
                              >
                                {String.fromCharCode(65 + i)}.
                              </strong>{" "}
                              {opt}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>

          {questions.length === 0 && (
            <div className="card empty-state" style={{ margin: "2rem 0" }}>
              <div className="empty-state-icon">❔</div>
              <p
                style={{
                  fontSize: "1.125rem",
                  fontWeight: 600,
                  color: "var(--color-gray-700)",
                  marginBottom: "0.5rem",
                }}
              >
                No questions yet.
              </p>
              <p
                style={{
                  maxWidth: "380px",
                  margin: "0 auto 1.5rem",
                  fontSize: "0.875rem",
                }}
              >
                Get started by creating your own practice questions with options
                and answers.
              </p>
              <a
                href="/questions/new"
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
                Add the First Question
              </a>
            </div>
          )}
        </>
      )}

      {/* Create Quiz Modal */}
      {quizModalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0, 0, 0, 0.45)",
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
              maxWidth: "460px",
              width: "100%",
              background: "#fff",
              borderRadius: "var(--radius-xl)",
            }}
          >
            <h3 style={{ fontSize: "1.25rem", marginBottom: "0.5rem" }}>
              🎯 Create Quiz from Selection
            </h3>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-gray-500)",
                marginBottom: "1.25rem",
              }}
            >
              You selected {selectedQuestions.length} questions to include in
              this quiz.
            </p>

            <form
              onSubmit={handleCreateQuiz}
              style={{ display: "grid", gap: "1rem" }}
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
                  Quiz Title
                </label>
                <input
                  placeholder="e.g. Midterm Practice Quiz"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  required
                />
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
                  Quiz Topic
                </label>
                <input
                  placeholder="e.g. Biology, Algebra"
                  value={quizTopic}
                  onChange={(e) => setQuizTopic(e.target.value)}
                  required
                />
              </div>

              {quizMsg && (
                <div
                  className={`alert ${
                    quizMsg.includes("success")
                      ? "alert-success"
                      : "alert-error"
                  }`}
                >
                  {quizMsg}
                </div>
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
                  className="btn-secondary"
                  onClick={() => setQuizModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" disabled={quizCreating}>
                  {quizCreating ? "Creating..." : "Create & Start Quiz"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
