import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        try {
          if (typeof window !== "undefined" && window.localStorage) {
            window.localStorage.setItem("token", data.token);
            if (data.user?.name) {
              window.localStorage.setItem("userName", data.user.name);
            }
          }
        } catch {
          // ignore
        }
        setIsSuccess(true);
        setMsg(`Logged in as ${data.user.name}`);
        setTimeout(() => {
          if (typeof window !== "undefined") {
            window.location.href = "/materials";
          }
        }, 1200);
      } else {
        setIsSuccess(false);
        setMsg(data.error || "Login failed");
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
            🔑
          </div>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Login</h2>
          <p style={{ color: "var(--color-gray-500)", fontSize: "0.875rem" }}>
            Welcome back! Enter your credentials to access your account.
          </p>
        </div>

        <form onSubmit={submit} style={{ display: "grid", gap: "1rem" }}>
          <div>
            <label
              htmlFor="login-email"
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
              id="login-email"
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={update}
              required
              autoComplete="email"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
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
              id="login-password"
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={update}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ marginTop: "0.5rem", width: "100%", padding: "0.75rem" }}
          >
            {loading ? "Logging in..." : "Log in"}
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
          Don&apos;t have an account?{" "}
          <a
            href="/register"
            style={{ fontWeight: 600, color: "var(--color-primary)" }}
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
}
