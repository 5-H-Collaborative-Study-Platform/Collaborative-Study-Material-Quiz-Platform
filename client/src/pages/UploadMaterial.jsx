import { useState } from "react";

export default function UploadMaterial() {
  const [form, setForm] = useState({ title: "", subject: "", topic: "" });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!form.title || !form.subject || !form.topic) {
      setError("Title, subject and topic are required.");
      return;
    }
    if (!file) {
      setError("Please choose a file to upload.");
      return;
    }

    const data = new FormData();
    data.append("title", form.title);
    data.append("subject", form.subject);
    data.append("topic", form.topic);
    data.append("file", file);

    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: data,
      });
      if (!res.ok) throw new Error("Upload failed");
      setStatus("Material uploaded successfully.");
      setForm({ title: "", subject: "", topic: "" });
      setFile(null);
    } catch {
      setError("Upload failed. Please try again.");
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 320 }}>
      <h2>Upload study material</h2>
      <input name="title" placeholder="Title" value={form.title} onChange={update} />
      <input name="subject" placeholder="Subject" value={form.subject} onChange={update} />
      <input name="topic" placeholder="Topic" value={form.topic} onChange={update} />
      <input
        type="file"
        aria-label="file"
        onChange={(e) => setFile(e.target.files[0] || null)}
      />
      <button type="submit">Upload material</button>
      {error && <p role="alert">{error}</p>}
      {status && <p role="status">{status}</p>}
    </form>
  );
}
