import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [summary, setSummary] = useState({ attempts: 0, averageScore: 0 });

  useEffect(() => {
    const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };
    fetch("/api/performance/over-time", { headers }).then(
      (r) =>
        r.ok &&
        r.json().then((d) =>
          setData(d.map((a, i) => ({ name: `#${i + 1}`, score: a.score }))),
        ),
    );
    fetch("/api/performance/me", { headers }).then(
      (r) => r.ok && r.json().then(setSummary),
    );
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h2>Your dashboard</h2>
      <p>
        Attempts: {summary.attempts} · Average: {summary.averageScore.toFixed(1)}%
      </p>
      <LineChart width={400} height={240} data={data}>
        <XAxis dataKey="name" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Line type="monotone" dataKey="score" stroke="#4f46e5" />
      </LineChart>
    </div>
  );
}