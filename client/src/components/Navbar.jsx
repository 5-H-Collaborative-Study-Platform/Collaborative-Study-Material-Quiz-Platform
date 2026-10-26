import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        padding: 12,
        borderBottom: "1px solid #ddd",
      }}
    >
      <Link to="/">Home</Link>
      <Link to="/register">Register</Link>
      <Link to="/login">Login</Link>
      <Link to="/questions">Question Bank</Link>
      <Link to="/questions/new">Add Question</Link>
    </nav>
  );
}
