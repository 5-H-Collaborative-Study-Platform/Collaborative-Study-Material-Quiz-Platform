
import { useEffect, useState } from "react";

export default function Questions() {
  const [questions, setQuestions] = useState([]);
  const [difficulty, setDifficulty] = useState("");

  const load = async (d = "") => {
    const res = await fetch(`/api/questions${d ? `?difficulty=${d}` : ""}`);
    if (res.ok) setQuestions(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const onFilter = (e) => {
    setDifficulty(e.target.value);
    load(e.target.value);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Question bank</h2>
      <select
        value={difficulty}
        onChange={onFilter}
        aria-label="filter difficulty"
      >
        <option value="">all</option>
        <option value="easy">easy</option>
        <option value="medium">medium</option>
        <option value="hard">hard</option>
      </select>
      <ul>
        {questions.map((q) => (
          <li key={q._id}>
            {q.text} ({q.topic}, {q.difficulty})
          </li>
        ))}
      </ul>
      {questions.length === 0 && <p>No questions yet.</p>}
    </div>
  );
}
