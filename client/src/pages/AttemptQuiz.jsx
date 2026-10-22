import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function AttemptQuiz({ quizId = "demo" }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [seconds, setSeconds] = useState(120);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

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
    if (done) return;

    setDone(true);

    try {
      const response = await fetch("/api/attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
    } catch {
      setError("Could not submit your attempt. Please contact your instructor.");
    }
  };

  useEffect(() => {
    if (seconds === 0 && !done && quiz) {
      submit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds, done, quiz]);

  if (error && !quiz) return <p role="alert">{error}</p>;
  if (!quiz) return <p style={{ padding: 24 }}>Loading quiz...</p>;

  return (
    <div style={{ padding: 24 }}>
      <h2>{quiz.title}</h2>
      <p role="timer">Time left: {seconds}s</p>

      {quiz.questions.map((question) => (
        <div key={question._id}>
          <p>{question.text}</p>
          {question.options.map((option) => (
            <label key={option} style={{ display: "block" }}>
              <input
                type="radio"
                name={question._id}
                value={option}
                checked={answers[question._id] === option}
                disabled={done}
                onChange={() =>
                  setAnswers((current) => ({
                    ...current,
                    [question._id]: option,
                  }))
                }
              />
              {option}
            </label>
          ))}
        </div>
      ))}

      <button onClick={submit} disabled={done}>
        Submit
      </button>

      {done && <p role="status">Attempt submitted.</p>}
      {error && <p role="alert">{error}</p>}
    </div>
  );
}