import { useState } from "react";

const initialForm = {
  text: "",
  optionA: "",
  optionB: "",
  correctAnswer: "",
  subject: "",
  topic: "",
  difficulty: "medium",
};

export default function AddQuestion() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [ok, setOk] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const change = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const setCorrectOption = (val) => {
    setForm((current) => ({ ...current, correctAnswer: val }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setOk(false);

    const required = [
      "text",
      "optionA",
      "optionB",
      "correctAnswer",
      "subject",
      "topic",
    ];

    if (required.some((field) => !form[field].trim())) {
      setError(
        "Text, both options, correct answer, subject and topic are required",
      );
      return;
    }

    if (![form.optionA, form.optionB].includes(form.correctAnswer)) {
      setError("Correct answer must match Option A or Option B");
      return;
    }

    setSubmitting(true);

    const token =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("token")
        : null;

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text: form.text.trim(),
          options: [form.optionA.trim(), form.optionB.trim()],
          correctAnswer: form.correctAnswer.trim(),
          subject: form.subject.trim(),
          topic: form.topic.trim(),
          difficulty: form.difficulty,
        }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error || body.message || "Failed to add question");
      }

      setOk(true);
      setForm(initialForm);
    } catch (err) {
      setError(err.message || "Failed to add question");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page fade-in">
      <div style={{ maxWidth: "560px", margin: "1rem auto 3rem" }}>
        {/* Breadcrumb */}
        <div style={{ marginBottom: "1.25rem" }}>
          <a
            href="/questions"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.875rem",
              color: "var(--color-gray-500)",
              textDecoration: "none",
            }}
          >
            ← Back to Question Bank
          </a>
        </div>

        <div className="card card-body" style={{ padding: "2.25rem" }}>
          <div style={{ marginBottom: "1.75rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "0.25rem 0.65rem",
                borderRadius: "var(--radius-full)",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
                fontSize: "0.75rem",
                fontWeight: 600,
                marginBottom: "0.5rem",
              }}
            >
              Collaborative Bank
            </span>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>
              Add a question
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-gray-500)",
                margin: 0,
              }}
            >
              Create multiple-choice practice questions to expand the collective
              study repository.
            </p>
          </div>

          <form onSubmit={submit} style={{ display: "grid", gap: "1.125rem" }}>
            {error && (
              <div className="alert alert-error" role="alert">
                ⚠️ {error}
              </div>
            )}

            {ok && (
              <div className="alert alert-success" role="status">
                ✅ Question added!
              </div>
            )}

            <div>
              <label
                htmlFor="q-text"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-gray-700)",
                  marginBottom: "0.35rem",
                }}
              >
                Question Statement{" "}
                <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                id="q-text"
                name="text"
                placeholder="Question"
                value={form.text}
                onChange={change}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.35rem",
                  }}
                >
                  <label
                    htmlFor="q-optionA"
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--color-gray-700)",
                    }}
                  >
                    Option A{" "}
                    <span style={{ color: "var(--color-danger)" }}>*</span>
                  </label>
                  {form.optionA && (
                    <button
                      type="button"
                      onClick={() => setCorrectOption(form.optionA)}
                      style={{
                        padding: "0.15rem 0.45rem",
                        fontSize: "0.7rem",
                        background:
                          form.correctAnswer === form.optionA
                            ? "var(--color-success)"
                            : "var(--color-gray-100)",
                        color:
                          form.correctAnswer === form.optionA
                            ? "#fff"
                            : "var(--color-gray-700)",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {form.correctAnswer === form.optionA
                        ? "✓ Correct"
                        : "Set Correct"}
                    </button>
                  )}
                </div>
                <input
                  id="q-optionA"
                  name="optionA"
                  placeholder="Option A"
                  value={form.optionA}
                  onChange={change}
                />
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.35rem",
                  }}
                >
                  <label
                    htmlFor="q-optionB"
                    style={{
                      fontSize: "0.8125rem",
                      fontWeight: 600,
                      color: "var(--color-gray-700)",
                    }}
                  >
                    Option B{" "}
                    <span style={{ color: "var(--color-danger)" }}>*</span>
                  </label>
                  {form.optionB && (
                    <button
                      type="button"
                      onClick={() => setCorrectOption(form.optionB)}
                      style={{
                        padding: "0.15rem 0.45rem",
                        fontSize: "0.7rem",
                        background:
                          form.correctAnswer === form.optionB
                            ? "var(--color-success)"
                            : "var(--color-gray-100)",
                        color:
                          form.correctAnswer === form.optionB
                            ? "#fff"
                            : "var(--color-gray-700)",
                        borderRadius: "var(--radius-sm)",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      {form.correctAnswer === form.optionB
                        ? "✓ Correct"
                        : "Set Correct"}
                    </button>
                  )}
                </div>
                <input
                  id="q-optionB"
                  name="optionB"
                  placeholder="Option B"
                  value={form.optionB}
                  onChange={change}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="q-correctAnswer"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-gray-700)",
                  marginBottom: "0.35rem",
                }}
              >
                Correct Answer{" "}
                <span style={{ color: "var(--color-danger)" }}>*</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--color-gray-400)",
                    fontWeight: 400,
                    marginLeft: "0.5rem",
                  }}
                >
                  (Must match Option A or Option B exactly)
                </span>
              </label>
              <input
                id="q-correctAnswer"
                name="correctAnswer"
                placeholder="Correct answer"
                value={form.correctAnswer}
                onChange={change}
              />
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <div>
                <label
                  htmlFor="q-subject"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-gray-700)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Subject{" "}
                  <span style={{ color: "var(--color-danger)" }}>*</span>
                </label>
                <input
                  id="q-subject"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={change}
                />
              </div>

              <div>
                <label
                  htmlFor="q-topic"
                  style={{
                    display: "block",
                    fontSize: "0.8125rem",
                    fontWeight: 600,
                    color: "var(--color-gray-700)",
                    marginBottom: "0.35rem",
                  }}
                >
                  Topic <span style={{ color: "var(--color-danger)" }}>*</span>
                </label>
                <input
                  id="q-topic"
                  name="topic"
                  placeholder="Topic"
                  value={form.topic}
                  onChange={change}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="q-difficulty"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-gray-700)",
                  marginBottom: "0.35rem",
                }}
              >
                Difficulty Level
              </label>
              <select
                id="q-difficulty"
                name="difficulty"
                aria-label="difficulty"
                value={form.difficulty}
                onChange={change}
              >
                <option value="easy">easy</option>
                <option value="medium">medium</option>
                <option value="hard">hard</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
              }}
            >
              {submitting ? "Adding..." : "Add question"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
