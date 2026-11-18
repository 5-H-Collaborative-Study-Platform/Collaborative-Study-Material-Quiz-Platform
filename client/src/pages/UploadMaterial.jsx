import { useState } from "react";

export default function UploadMaterial() {
  const [form, setForm] = useState({
    title: "",
    subject: "",
    topic: "",
    description: "",
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);

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

    setUploading(true);
    const data = new FormData();
    data.append("title", form.title);
    data.append("subject", form.subject);
    data.append("topic", form.topic);
    if (form.description) {
      data.append("description", form.description);
    }
    data.append("file", file);

    const token =
      typeof window !== "undefined" && window.localStorage
        ? window.localStorage.getItem("token")
        : null;

    try {
      const res = await fetch("/api/materials", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Upload failed");
      }

      setStatus("Material uploaded successfully.");
      setForm({ title: "", subject: "", topic: "", description: "" });
      setFile(null);
    } catch (err) {
      setError(err.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="container page fade-in">
      <div style={{ maxWidth: "560px", margin: "1rem auto 3rem" }}>
        {/* Navigation Breadcrumb */}
        <div style={{ marginBottom: "1.25rem" }}>
          <a
            href="/materials"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.35rem",
              fontSize: "0.875rem",
              color: "var(--color-gray-500)",
              textDecoration: "none",
            }}
          >
            ← Back to Materials
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
              Share Notes & Documents
            </span>
            <h2 style={{ fontSize: "1.5rem", marginBottom: "0.35rem" }}>
              Upload study material
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--color-gray-500)",
                margin: 0,
              }}
            >
              Contribute reference documents, summaries, and exam prep for your
              classmates.
            </p>
          </div>

          <form onSubmit={submit} style={{ display: "grid", gap: "1.125rem" }}>
            <div>
              <label
                htmlFor="mat-title"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-gray-700)",
                  marginBottom: "0.35rem",
                }}
              >
                Material Title{" "}
                <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                id="mat-title"
                name="title"
                placeholder="Title"
                value={form.title}
                onChange={update}
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
                  htmlFor="mat-subject"
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
                  id="mat-subject"
                  name="subject"
                  placeholder="Subject"
                  value={form.subject}
                  onChange={update}
                />
              </div>

              <div>
                <label
                  htmlFor="mat-topic"
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
                  id="mat-topic"
                  name="topic"
                  placeholder="Topic"
                  value={form.topic}
                  onChange={update}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="mat-desc"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-gray-700)",
                  marginBottom: "0.35rem",
                }}
              >
                Description (Optional)
              </label>
              <textarea
                id="mat-desc"
                name="description"
                rows="2"
                placeholder="Brief summary of what this document covers..."
                value={form.description}
                onChange={update}
                style={{ resize: "vertical" }}
              />
            </div>

            <div>
              <label
                htmlFor="mat-file"
                style={{
                  display: "block",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: "var(--color-gray-700)",
                  marginBottom: "0.35rem",
                }}
              >
                File Attachment (PDF, PPT, DOC, etc.){" "}
                <span style={{ color: "var(--color-danger)" }}>*</span>
              </label>
              <input
                id="mat-file"
                type="file"
                aria-label="file"
                onChange={(e) => setFile(e.target.files[0] || null)}
              />
              {file && (
                <div
                  style={{
                    marginTop: "0.5rem",
                    fontSize: "0.8125rem",
                    color: "var(--color-primary)",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.35rem",
                  }}
                >
                  <span>📎</span> Selected: <strong>{file.name}</strong> (
                  {(file.size / 1024).toFixed(1)} KB)
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={uploading}
              style={{
                width: "100%",
                padding: "0.75rem",
                marginTop: "0.5rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.5rem",
              }}
            >
              {uploading ? (
                <>
                  <span
                    className="spinner"
                    style={{ width: "1rem", height: "1rem" }}
                  ></span>
                  Uploading...
                </>
              ) : (
                "Upload material"
              )}
            </button>

            {error && (
              <div
                className="alert alert-error"
                role="alert"
                style={{ marginTop: "0.25rem" }}
              >
                ⚠️ {error}
              </div>
            )}

            {status && (
              <div
                className="alert alert-success"
                role="status"
                style={{ marginTop: "0.25rem" }}
              >
                ✅ {status}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
