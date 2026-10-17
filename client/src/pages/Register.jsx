import { useState } from "react";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [msg, setMsg] = useState("");
  const update = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  async function submit(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setMsg(res.ok ? `Registered as ${data.email}` : data.error);
  }

  return (
    <form onSubmit={submit} style={{ display: "grid", gap: 10, maxWidth: 320 }}>
      <h2>Register</h2>
      <input name="name" placeholder="Name" value={form.name} onChange={update} />
      <input name="email" placeholder="Email" value={form.email} onChange={update} />
      <input name="password" type="password" placeholder="Password" value={form.password} onChange={update} />
      <button type="submit">Create account</button>
      {msg && <p>{msg}</p>}
    </form>
  );
}