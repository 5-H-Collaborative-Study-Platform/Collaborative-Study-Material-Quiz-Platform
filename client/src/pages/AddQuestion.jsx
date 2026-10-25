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
      setError("Text, both options, correct answer, subject and topic are required");
      return;
    }

    if (![form.optionA, form.optionB].includes(form.correctAnswer)) {
      setError("Correct answer must match Option A or Option B");
      return;
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    <form onSubmit={submit} style={{ padding: 24, maxWidth: 460 }}>
      <h2>Add a question</h2>

      {error && (
        <p role="alert" style={{ color: "crimson" }}>
          {error}
        </p>
      )}

      {ok && <p role="status">Question added!</p>}

      <input
        name="text"
        placeholder="Question"
        value={form.text}
        onChange={change}
      />

      <input
        name="optionA"
        placeholder="Option A"
        value={form.optionA}
        onChange={change}
      />

      <input
        name="optionB"
        placeholder="Option B"
        value={form.optionB}
        onChange={change}
      />

      <input
        name="correctAnswer"
        placeholder="Correct answer"
        value={form.correctAnswer}
        onChange={change}
      />

      <input
        name="subject"
        placeholder="Subject"
        value={form.subject}
        onChange={change}
      />

      <input
        name="topic"
        placeholder="Topic"
        value={form.topic}
        onChange={change}
      />

      <select
        name="difficulty"
        aria-label="difficulty"
        value={form.difficulty}
        onChange={change}
      >
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>

      <button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add question"}
      </button>
    </form>
  );
}
