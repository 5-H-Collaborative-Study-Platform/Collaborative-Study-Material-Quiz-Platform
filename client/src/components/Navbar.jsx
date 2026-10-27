import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function getStoredItem(key) {
  try {
    if (typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
  } catch {
    // ignore security/sandbox errors
  }
  return null;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = getStoredItem("token");
    const name = getStoredItem("userName");
    if (token && name) {
      setUser({ name });
    } else if (!token) {
      setUser(null);
    }
  }, [location]);

  const logout = () => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem("token");
        window.localStorage.removeItem("userName");
      }
    } catch {
      // ignore
    }
    setUser(null);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const linkStyle = (path) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "0.35rem",
    padding: "0.5rem 0.85rem",
    borderRadius: "var(--radius-md)",
    fontSize: "0.875rem",
    fontWeight: isActive(path) ? "600" : "500",
    color: isActive(path) ? "var(--color-primary)" : "var(--color-gray-700)",
    background: isActive(path) ? "var(--color-primary-light)" : "transparent",
    textDecoration: "none",
    transition: "all var(--transition-fast)",
  });

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid var(--color-gray-200)",
        boxShadow: "var(--shadow-xs)",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "var(--nav-height)",
          gap: "1rem",
        }}
      >
        {/* Brand / Logo */}
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            textDecoration: "none",
            fontWeight: 800,
            fontSize: "1.2rem",
            color: "var(--color-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          <span style={{ fontSize: "1.4rem" }}>📚</span>
          <span>StudyHub</span>
        </Link>

        {/* Navigation Links */}
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.35rem",
          }}
        >
          <Link to="/" style={linkStyle("/")}>
            Home
          </Link>
          <Link to="/materials" style={linkStyle("/materials")}>
            Materials
          </Link>
          <Link to="/materials/upload" style={linkStyle("/materials/upload")}>
            Upload Material
          </Link>
          <Link to="/questions" style={linkStyle("/questions")}>
            Question Bank
          </Link>
          <Link to="/questions/new" style={linkStyle("/questions/new")}>
            Add Question
          </Link>
          <Link to="/performance" style={linkStyle("/performance")}>
            Performance
          </Link>
        </nav>

        {/* User / Auth CTA */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {user ? (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.35rem",
                  padding: "0.3rem 0.65rem",
                  background: "var(--color-primary-light)",
                  color: "var(--color-primary-700)",
                  borderRadius: "var(--radius-full)",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                }}
              >
                👤 {user.name}
              </span>
              <button
                type="button"
                onClick={logout}
                className="btn-secondary btn-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link to="/register" style={linkStyle("/register")}>
                Register
              </Link>
              <Link
                to="/login"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "0.45rem 1rem",
                  background: "var(--color-primary)",
                  color: "#fff",
                  borderRadius: "var(--radius-md)",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                  textDecoration: "none",
                  transition: "background var(--transition-fast)",
                }}
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
