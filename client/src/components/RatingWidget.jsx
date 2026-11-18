import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
export default function RatingWidget({ targetId }) {
  const [summary, setSummary] = useState({
    count: 0,
    average: 0,
  });

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    const res = await fetch(
      `/api/feedback?targetId=${targetId}`
    );

    if (res.ok) {
      setSummary(await res.json());
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        targetId,
        rating: Number(rating),
        comment,
      }),
    });

    if (!res.ok) {
      setError("Could not submit rating");
      return;
    }

    setComment("");
    load();
  };

  return (
    <div style={{ padding: 16 }}>
      <p>
        Average rating: {summary.average.toFixed(1)} ({summary.count})
      </p>

      <form onSubmit={submit}>
        {error && <p role="alert">{error}</p>}

        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          aria-label="rating"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>

        <input
          placeholder="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <button type="submit">Rate</button>
      </form>
    </div>
  );
}