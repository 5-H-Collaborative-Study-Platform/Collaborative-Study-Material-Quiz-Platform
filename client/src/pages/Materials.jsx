import { useEffect, useState } from "react";

export default function Materials() {
  const [materials, setMaterials] = useState([]);
  const [q, setQ] = useState("");

  const load = async (search = "") => {
    const res = await fetch(
      `/api/materials${search ? `?q=${encodeURIComponent(search)}` : ""}`,
    );
    if (res.ok) setMaterials(await res.json());
  };

  useEffect(() => {
    load();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    load(q);
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Study materials</h2>
      <form onSubmit={onSearch} style={{ display: "flex", gap: 8 }}>
        <input
          placeholder="Search materials"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {materials.map((m) => (
          <li key={m._id}>
            {m.title} — {m.subject} / {m.topic}{" "}
            <a href={`/api/materials/${m._id}/download`}>download</a>
          </li>
        ))}
      </ul>
      {materials.length === 0 && <p>No materials found.</p>}
    </div>
  );
}
