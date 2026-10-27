import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setIsSuccess(true);
        setMsg(`Registered as ${data.email}`);
      } else {
        setIsSuccess(false);
        setMsg(data.error || "Registration failed");
      }
    } catch {
      setIsSuccess(false);
      setMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container page fade-in">
      <div
        className="card"
        style={{
          maxWidth: "420px",
          margin: "2rem auto",
          padding: "2rem 2.25rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "3.25rem",
              height: "3.25rem",
              borderRadius: "50%",
              background: "var(--color-primary-light)",
              color: "var(--color-primary)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              margin: "0 auto 1rem",
            }}
          >
            ✨
          </div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Register</h2>
          <p style={{ color: "var(--color-gray-500)", fontSize: "0.875rem" }}>
            Join the platform to share study materials and test your knowledge.
          </p>
        </div>

        <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label
              htmlFor="reg-name"
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-gray-700)",
                marginBottom: "0.35rem",
              }}
            >
              Full Name
            </label>
            <input
              id="reg-name"
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={update}
              required
            />
          </div>

          <div>
            <label
              htmlFor="reg-email"
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-gray-700)",
                marginBottom: "0.35rem",
              }}
            >
              Email Address
            </label>
            <input
              id="reg-email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={update}
              required
            />
          </div>

          <div>
            <label
              htmlFor="reg-password"
              style={{
                display: "block",
                fontSize: "0.8125rem",
                fontWeight: 600,
                color: "var(--color-gray-700)",
                marginBottom: "0.35rem",
              }}
            >
              Password
            </label>
            <input
              id="reg-password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={update}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: "0.5rem", width: "100%", padding: "0.75rem" }}
          >
            {loading ? "Creating account..." : "Create account"}
          </button>

          {msg && (
            <div
              className={`alert ${isSuccess ? "alert-success" : "alert-error"}`}
              style={{ marginTop: "0.5rem" }}
            >
              <p style={{ margin: 0, color: "inherit", fontWeight: 500 }}>{msg}</p>
            </div>
          )}
        </form>

        <div
          style={{
            marginTop: "1.75rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--color-gray-200)",
            textAlign: "center",
            fontSize: "0.875rem",
            color: "var(--color-gray-500)",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{ fontWeight: 600, color: "var(--color-primary)" }}
          >
            Log in here
          </a>
        </div>
      </div>
    </div>
  );
}
