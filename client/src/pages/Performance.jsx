import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function getToken() {
  try {
    return localStorage.getItem("token");
  } catch {
    return null;
  }
}

export default function Performance() {
  const [summary, setSummary] = useState(null);
  const [byTopic, setByTopic] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = getToken();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      fetch("/api/performance/me", { headers }).then((res) =>
        res.ok ? res.json() : Promise.reject("Failed to load overall summary")
      ),
      fetch("/api/performance/by-topic", { headers }).then((res) =>
        res.ok ? res.json() : []
      ),
      fetch("/api/performance/over-time", { headers }).then((res) =>
        res.ok ? res.json() : []
      ),
    ])
      .then(([summaryData, topicData, historyData]) => {
        setSummary(summaryData);
        setByTopic(topicData || []);
        setHistory(Array.isArray(historyData) ? historyData.reverse() : []);
      })
      .catch((err) => {
        setError(typeof err === "string" ? err : "Could not load performance stats.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (!token) {
    return (
      <div className="container page fade-in">
        <div
          className="card"
          style={{
            maxWidth: "520px",
            margin: "3rem auto",
            textAlign: "center",
            padding: "2.5rem 1.5rem",
          }}
        >
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🔒</div>
          <h2 style={{ marginBottom: "0.5rem" }}>Login Required</h2>
          <p style={{ color: "var(--color-gray-500)", marginBottom: "1.5rem" }}>
            Please log in with your account to view your quiz performance, topic mastery, and score history.
          </p>
          <Link
            to="/login"
            style={{
              display: "inline-flex",
              padding: "0.625rem 1.5rem",
              background: "var(--color-primary)",
              color: "#fff",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading-page">
        <span className="spinner"></span>
        <p>Loading your performance statistics...</p>
      </div>
    );
  }

  const averageScore = summary ? Math.round(summary.averageScore || 0) : 0;
  const totalAttempts = summary ? summary.attempts || 0 : 0;

  return (
    <div className="container page fade-in">
      <div className="page-header">
        <h2>Performance Dashboard</h2>
        <p>Track your learning progress, quiz scores, and subject mastery over time.</p>
      </div>

      {error && (
        <div className="alert alert-error" role="alert" style={{ marginBottom: "1.5rem" }}>
          ⚠️ {error}
        </div>
      )}

      {/* Summary KPI Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div className="card card-body" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            🎯
          </div>
          <div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-gray-500)", fontWeight: 500 }}>
              Total Attempts
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-gray-900)" }}>
              {totalAttempts}
            </div>
          </div>
        </div>

        <div className="card card-body" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "var(--radius-lg)",
              background: averageScore >= 70 ? "var(--color-success-light)" : "var(--color-warning-light)",
              color: averageScore >= 70 ? "var(--color-success)" : "var(--color-warning)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            📊
          </div>
          <div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-gray-500)", fontWeight: 500 }}>
              Average Score
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-gray-900)" }}>
              {averageScore}%
            </div>
          </div>
        </div>

        <div className="card card-body" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <div
            style={{
              width: "3rem",
              height: "3rem",
              borderRadius: "var(--radius-lg)",
              background: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
            }}
          >
            🏆
          </div>
          <div>
            <div style={{ fontSize: "0.8125rem", color: "var(--color-gray-500)", fontWeight: 500 }}>
              Topics Covered
            </div>
            <div style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-gray-900)" }}>
              {byTopic.length}
            </div>
          </div>
        </div>
      </div>

      {totalAttempts === 0 ? (
        <div className="card empty-state" style={{ margin: "2rem 0" }}>
          <div className="empty-state-icon">📝</div>
          <h3 style={{ marginBottom: "0.5rem" }}>No Quiz Attempts Yet</h3>
          <p style={{ maxWidth: "420px", margin: "0 auto 1.5rem" }}>
            Take practice quizzes to evaluate your knowledge and view your learning insights here.
          </p>
          <Link
            to="/questions"
            style={{
              display: "inline-flex",
              padding: "0.625rem 1.25rem",
              background: "var(--color-primary)",
              color: "#fff",
              borderRadius: "var(--radius-md)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            Explore Question Bank
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
          {/* Performance by Topic */}
          <div className="card card-body">
            <h3 style={{ fontSize: "1.125rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>📑</span> Performance by Topic
            </h3>
            {byTopic.length === 0 ? (
              <p style={{ color: "var(--color-gray-400)", fontSize: "0.875rem" }}>No topic data available.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {byTopic.map((item, idx) => {
                  const score = Math.round(item.averageScore || 0);
                  return (
                    <div key={idx} style={{ padding: "0.75rem", background: "var(--color-gray-50)", borderRadius: "var(--radius-md)" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.35rem" }}>
                        <span style={{ fontWeight: 600, fontSize: "0.875rem", color: "var(--color-gray-800)" }}>
                          {item.topic}
                        </span>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                            {item.attempts} {item.attempts === 1 ? "attempt" : "attempts"}
                          </span>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "0.875rem",
                              color: score >= 70 ? "var(--color-success)" : "var(--color-warning)",
                            }}
                          >
                            {score}%
                          </span>
                        </div>
                      </div>
                      <div
                        style={{
                          width: "100%",
                          height: "6px",
                          background: "var(--color-gray-200)",
                          borderRadius: "var(--radius-full)",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${Math.min(100, Math.max(0, score))}%`,
                            height: "100%",
                            background: score >= 70 ? "var(--color-success)" : "var(--color-warning)",
                            borderRadius: "var(--radius-full)",
                            transition: "width 0.5s ease",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Recent Quiz Attempts */}
          <div className="card card-body">
            <h3 style={{ fontSize: "1.125rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <span>🕒</span> Recent Attempts
            </h3>
            {history.length === 0 ? (
              <p style={{ color: "var(--color-gray-400)", fontSize: "0.875rem" }}>No attempts recorded yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {history.slice(0, 8).map((attempt, index) => {
                  const score = Math.round(attempt.score || 0);
                  const date = attempt.submittedAt
                    ? new Date(attempt.submittedAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Recently";

                  return (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0.75rem",
                        border: "1px solid var(--color-gray-200)",
                        borderRadius: "var(--radius-md)",
                        background: "#fff",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div
                          style={{
                            width: "2.25rem",
                            height: "2.25rem",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.8125rem",
                            fontWeight: 700,
                            background:
                              score >= 80
                                ? "var(--color-success-light)"
                                : score >= 50
                                ? "var(--color-warning-light)"
                                : "var(--color-danger-light)",
                            color:
                              score >= 80
                                ? "var(--color-success)"
                                : score >= 50
                                ? "var(--color-warning)"
                                : "var(--color-danger)",
                          }}
                        >
                          {score}%
                        </div>
                        <div>
                          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "var(--color-gray-800)" }}>
                            Quiz Attempt #{history.length - index}
                          </div>
                          <div style={{ fontSize: "0.75rem", color: "var(--color-gray-500)" }}>
                            {date}
                          </div>
                        </div>
                      </div>
                      <span
                        className={`badge ${
                          score >= 80 ? "badge-easy" : score >= 50 ? "badge-medium" : "badge-hard"
                        }`}
                      >
                        {score >= 80 ? "Pass (Great)" : score >= 50 ? "Pass" : "Needs Review"}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
