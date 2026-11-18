import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function AttemptQuiz({ quizId = "demo" }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(120);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackMsg, setFeedbackMsg] = useState("");

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/quizzes/${quizId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load quiz");
        return response.json();
      })
      .then((data) => {
        if (!cancelled) setQuiz(data);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load quiz.");
      });

    return () => {
      cancelled = true;
    };
  }, [quizId]);

  useEffect(() => {
    if (done || seconds <= 0) return undefined;

    const timer = setInterval(() => {
      setSeconds((current) => Math.max(0, current - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds, done]);

  const submit = async () => {
    if (done || submitting) return;

    setSubmitting(true);
    setDone(true);

    const token =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("token")
        : null;

    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          quizId,
          answers: Object.entries(answers).map(([question, selected]) => ({
            question,
            selected,
          })),
        }),
      });

      if (!response.ok) throw new Error("Submission failed");
      const data = await response.json();
      setResult(data);
    } catch {
      setError(
        "Could not submit your attempt. Please contact your instructor.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (seconds === 0 && !done && quiz) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, done, quiz]);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    const token =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("token")
        : null;

    if (!token) {
      setFeedbackMsg("Please log in to submit feedback.");
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
          targetId: quiz._id,
          targetType: "quiz",
          rating: Number(feedbackRating),
          comment: feedbackComment,
        }),
      });

      if (res.ok) {
        setFeedbackMsg("Thank you! Feedback recorded.");
      } else {
        const err = await res.json().catch(() => ({}));
        setFeedbackMsg(err.error || "Failed to submit feedback.");
      }
    } catch {
      setFeedbackMsg("Error submitting feedback.");
    }
  };

  if (error && !quiz) {
    return (
      <div className="container page fade-in">
        <div
          className="card empty-state"
          style={{ maxWidth: "500px", margin: "3rem auto" }}
        >
          <div className="empty-state-icon">⚠️</div>
          <p
            role="alert"
            style={{ color: "var(--color-danger)", fontWeight: 600 }}
          >
            {error}
          </p>
          <a
            href="/questions"
            style={{
              display: "inline-flex",
              marginTop: "1.5rem",
              padding: "0.5rem 1.25rem",
              background: "var(--color-primary)",
              color: "#fff",
              borderRadius: "var(--radius-md)",
              textDecoration: "none",
            }}
          >
            Back to Questions
          </a>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="loading-page" style={{ padding: 24 }}>
        <span className="spinner"></span>
        <p>Loading quiz...</p>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalCount = quiz.questions?.length || 0;
  const progressPercent =
    totalCount > 0 ? (answeredCount / totalCount) * 100 : 0;

  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const isTimeCritical = seconds <= 30;

  return (
    <div className="container page fade-in">
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>
        {/* Quiz Sticky Header */}
        <div
          className="card"
          style={{
            padding: "1.25rem 1.5rem",
            marginBottom: "1.5rem",
            position: "sticky",
            top: "calc(var(--nav-height) + 1rem)",
            zIndex: 10,
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "0.75rem",
            }}
          >
            <div>
              <span
                className="badge badge-subject"
                style={{ marginBottom: "0.25rem" }}
              >
                {quiz.topic || "Quiz"}
              </span>
              <h2 style={{ fontSize: "1.35rem", margin: 0 }}>{quiz.title}</h2>
            </div>

            {/* Timer badge */}
            <div
              role="timer"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.35rem",
                padding: "0.4rem 0.85rem",
                borderRadius: "var(--radius-full)",
                fontSize: "0.9375rem",
                fontWeight: 700,
                background: isTimeCritical
                  ? "var(--color-danger-light)"
                  : "var(--color-primary-light)",
                color: isTimeCritical
                  ? "var(--color-danger)"
                  : "var(--color-primary)",
                border: `1.5px solid ${
                  isTimeCritical
                    ? "var(--color-danger-border)"
                    : "var(--color-primary-100)"
                }`,
              }}
            >
              <span>⏱️</span> Time left: {seconds}s ({minutes}:
              {remainingSecs < 10 ? `0${remainingSecs}` : remainingSecs})
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "1rem" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "var(--color-gray-500)",
                marginBottom: "0.25rem",
              }}
            >
              <span>Progress</span>
              <span>
                {answeredCount} of {totalCount} Answered
              </span>
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
                  width: `${progressPercent}%`,
                  height: "100%",
                  background: "var(--color-primary)",
                  borderRadius: "var(--radius-full)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>

        {/* Completion Result Card */}
        {done && (
          <div
            className="card card-body"
            style={{
              padding: "2rem",
              marginBottom: "2rem",
              textAlign: "center",
              background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
              border: "1.5px solid var(--color-success-border)",
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>
              {result && result.score >= 70 ? "🎉" : "📚"}
            </div>
            <p
              role="status"
              style={{
                fontSize: "1.25rem",
                fontWeight: 700,
                color: "var(--color-success)",
                margin: "0 0 0.5rem",
              }}
            >
              Attempt submitted.
            </p>

            {result && (
              <div style={{ margin: "1rem 0" }}>
                <div
                  style={{
                    fontSize: "2.75rem",
                    fontWeight: 800,
                    color: "var(--color-gray-900)",
                  }}
                >
                  {result.score}%
                </div>
                <p
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--color-gray-600)",
                  }}
                >
                  {result.score >= 80
                    ? "Outstanding performance! You have mastered this material."
                    : result.score >= 50
                    ? "Well done! Keep reviewing key concepts to improve further."
                    : "Good effort! Check study materials to reinforce challenging concepts."}
                </p>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "0.75rem",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "1.25rem",
              }}
            >
              <a
                href="/performance"
                style={{
                  display: "inline-flex",
                  padding: "0.625rem 1.25rem",
                  background: "var(--color-primary)",
                  color: "#fff",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                }}
              >
                View Analytics & Progress
              </a>
              <a
                href="/questions"
                style={{
                  display: "inline-flex",
                  padding: "0.625rem 1.25rem",
                  background: "#fff",
                  color: "var(--color-gray-700)",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  border: "1px solid var(--color-gray-300)",
                  textDecoration: "none",
                }}
              >
                Back to Questions
              </a>
            </div>

            {/* Quiz Feedback Section */}
            <div
              style={{
                marginTop: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(0, 0, 0, 0.08)",
                textAlign: "left",
              }}
            >
              <h4 style={{ fontSize: "1rem", marginBottom: "0.35rem" }}>
                Rate this Quiz
              </h4>
              <p
                style={{
                  fontSize: "0.8125rem",
                  color: "var(--color-gray-600)",
                  marginBottom: "0.75rem",
                }}
              >
                Was this quiz balanced and helpful? Let the creator know.
              </p>

              <form
                onSubmit={handleFeedbackSubmit}
                style={{ display: "grid", gap: "0.75rem" }}
              >
                <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                  <select
                    value={feedbackRating}
                    onChange={(e) => setFeedbackRating(e.target.value)}
                    style={{ flex: 1, maxWidth: "200px" }}
                  >
                    <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                    <option value="4">⭐⭐⭐⭐ 4 Stars</option>
                    <option value="3">⭐⭐⭐ 3 Stars</option>
                    <option value="2">⭐⭐ 2 Stars</option>
                    <option value="1">⭐ 1 Star</option>
                  </select>
                  <input
                    placeholder="Feedback comments (optional)"
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    style={{ flex: 2 }}
                  />
                  <button type="submit" className="btn-secondary btn-sm">
                    Send Feedback
                  </button>
                </div>
                {feedbackMsg && (
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--color-success)",
                      fontWeight: 600,
                      margin: 0,
                    }}
                  >
                    {feedbackMsg}
                  </p>
                )}
              </form>
            </div>
          </div>
        )}

        {/* Questions list */}
        <div
          style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
        >
          {quiz.questions.map((question, index) => (
            <div
              key={question._id}
              className="card"
              style={{
                padding: "1.5rem",
                border: answers[question._id]
                  ? "1.5px solid var(--color-primary)"
                  : "1px solid var(--color-gray-200)",
                borderRadius: "var(--radius-lg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  alignItems: "flex-start",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    width: "1.75rem",
                    height: "1.75rem",
                    borderRadius: "50%",
                    background: answers[question._id]
                      ? "var(--color-primary)"
                      : "var(--color-gray-200)",
                    color: answers[question._id]
                      ? "#fff"
                      : "var(--color-gray-700)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.8125rem",
                    flexShrink: 0,
                  }}
                >
                  {index + 1}
                </span>
                <p
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 600,
                    color: "var(--color-gray-900)",
                    margin: 0,
                    lineHeight: 1.45,
                  }}
                >
                  {question.text}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                  paddingLeft: "2.5rem",
                }}
              >
                {question.options.map((option) => {
                  const isChecked = answers[question._id] === option;
                  return (
                    <label
                      key={option}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.75rem",
                        padding: "0.75rem 1rem",
                        borderRadius: "var(--radius-md)",
                        border: isChecked
                          ? "1.5px solid var(--color-primary)"
                          : "1px solid var(--color-gray-200)",
                        background: isChecked
                          ? "var(--color-primary-light)"
                          : "var(--color-gray-50)",
                        cursor: done ? "default" : "pointer",
                        transition: "all var(--transition-fast)",
                        fontWeight: isChecked ? 600 : 400,
                        color: isChecked
                          ? "var(--color-primary-800)"
                          : "var(--color-gray-800)",
                      }}
                    >
                      <input
                        type="radio"
                        name={question._id}
                        value={option}
                        checked={isChecked}
                        disabled={done}
                        onChange={() =>
                          setAnswers((current) => ({
                            ...current,
                            [question._id]: option,
                          }))
                        }
                        style={{
                          width: "1.1rem",
                          height: "1.1rem",
                          cursor: "pointer",
                        }}
                      />
                      <span>{option}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit Actions */}
        {!done && (
          <div
            style={{
              marginTop: "2rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
              padding: "1rem 0",
            }}
          >
            <span
              style={{ fontSize: "0.875rem", color: "var(--color-gray-500)" }}
            >
              {totalCount - answeredCount > 0
                ? `${totalCount - answeredCount} unanswered questions remaining`
                : "All questions answered! Ready to submit."}
            </span>

            <button
              onClick={submit}
              disabled={done || submitting}
              style={{
                padding: "0.75rem 2rem",
                fontSize: "1rem",
              }}
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        )}

        {error && (
          <div
            className="alert alert-error"
            role="alert"
            style={{ marginTop: "1rem" }}
          >
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}
