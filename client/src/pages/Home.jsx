import { Link } from "react-router-dom";

export default function Home() {
  const isLoggedIn = !!(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  })();

  const features = [
    {
      icon: "📚",
      title: "Study Materials",
      desc: "Upload, browse and download study materials organized by subject and topic.",
      link: "/materials",
      color: "#eef2ff",
    },
    {
      icon: "❓",
      title: "Question Bank",
      desc: "Contribute and explore a collaborative bank of questions across subjects.",
      link: "/questions",
      color: "#ecfdf5",
    },
    {
      icon: "🎯",
      title: "Take Quizzes",
      desc: "Test your knowledge with timed quizzes and get instant auto-graded results.",
      link: "/questions",
      color: "#fffbeb",
    },
    {
      icon: "📊",
      title: "Track Performance",
      desc: "Monitor your progress over time with detailed performance analytics.",
      link: "/performance",
      color: "#fef2f2",
    },
  ];

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section
        style={{
          textAlign: "center",
          padding: "4.5rem 1.5rem 3.5rem",
          background: "linear-gradient(135deg, var(--color-primary-light) 0%, #f0f9ff 50%, #faf5ff 100%)",
          borderBottom: "1px solid var(--color-gray-200)",
        }}
      >
        <div style={{ maxWidth: "680px", margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              padding: "0.3rem 0.85rem",
              background: "#ffffff",
              borderRadius: "var(--radius-full)",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "var(--color-primary)",
              marginBottom: "1.25rem",
              border: "1px solid var(--color-primary-100)",
              boxShadow: "var(--shadow-xs)",
            }}
          >
            🎓 Collaborative Learning & Knowledge Sharing
          </span>

          <h1
            style={{
              fontSize: "clamp(2rem, 5vw, 2.85rem)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
              marginBottom: "1rem",
              color: "var(--color-gray-900)",
            }}
          >
            Collaborative Study & Quiz Platform
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              color: "var(--color-gray-600)",
              lineHeight: 1.6,
              marginBottom: "2rem",
            }}
          >
            Register or log in to start. Share study materials, create questions, take quizzes, and track your performance in real time.
          </p>

          <div
            style={{
              display: "flex",
              gap: "0.875rem",
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {isLoggedIn ? (
              <>
                <Link
                  to="/materials"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    background: "var(--color-primary)",
                    color: "white",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    textDecoration: "none",
                    boxShadow: "var(--shadow-md)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  📚 Browse Materials
                </Link>
                <Link
                  to="/questions"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    background: "white",
                    color: "var(--color-gray-700)",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    textDecoration: "none",
                    border: "1.5px solid var(--color-gray-300)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  ❓ Question Bank
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    background: "var(--color-primary)",
                    color: "white",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    textDecoration: "none",
                    boxShadow: "var(--shadow-md)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  Create Account
                </Link>
                <Link
                  to="/login"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.75rem 1.5rem",
                    background: "white",
                    color: "var(--color-gray-700)",
                    borderRadius: "var(--radius-md)",
                    fontWeight: 600,
                    fontSize: "0.9375rem",
                    textDecoration: "none",
                    border: "1.5px solid var(--color-gray-300)",
                    transition: "all var(--transition-fast)",
                  }}
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section style={{ maxWidth: "1000px", margin: "0 auto", padding: "3.5rem 1.5rem 4rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2
            style={{
              fontSize: "1.65rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "var(--color-gray-900)",
            }}
          >
            Everything you need for smarter study sessions
          </h2>
          <p
            style={{
              color: "var(--color-gray-500)",
              fontSize: "0.95rem",
            }}
          >
            Designed for students and educators to collaborate seamlessly.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((f) => (
            <Link
              key={f.title}
              to={f.link}
              className="card card-body"
              style={{
                textDecoration: "none",
                display: "block",
              }}
            >
              <div
                style={{
                  width: "3rem",
                  height: "3rem",
                  background: f.color,
                  borderRadius: "var(--radius-lg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  color: "var(--color-gray-900)",
                  marginBottom: "0.4rem",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: "0.85rem",
                  color: "var(--color-gray-500)",
                  lineHeight: 1.55,
                  margin: 0,
                }}
              >
                {f.desc}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}