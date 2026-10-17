import { useState } from "react";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      localStorage.setItem("token", data.token);
      setMsg(`Logged in as ${data.user.name}`);
    } else {
      setMsg(data.error);
    }
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 320 }}>
      <h2>Login</h2>
      <input name="email" placeholder="Email" value={form.email} onChange={update} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} />
      <button type="submit">Log in</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}