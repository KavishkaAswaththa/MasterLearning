"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { authenticateUser } from "@/lib/db";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("registered") === "true") {
        setSuccess("Account created successfully! You can now log in.");
      } else if (params.get("error") === "auth_required") {
        setError("Please log in to your account to access dashboard resources or take quizzes.");
      }
    }

    // Seed Firestore database on mount
    import("@/lib/db").then(({ seedDatabase }) => {
      seedDatabase();
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setIsLoading(true);

    try {
      const matchedUser = await authenticateUser(email, password);

      if (!matchedUser) {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem("user", JSON.stringify({
        email: matchedUser.email,
        role: matchedUser.role,
        name: matchedUser.name
      }));

      setSuccess(`Login successful! Redirecting to ${matchedUser.role} dashboard...`);
      
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div className="portal-bg"></div>
      
      <div className="glass-card" style={cardStyle}>
        {/* Portal Branding */}
        <div style={headerStyle}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", marginBottom: "20px" }}>
            <div className="logo-icon-auth">ML</div>
            <span className="logo-text-auth">
              Master<span className="logo-highlight-auth">Learning</span>
            </span>
          </div>
          <p style={subtitleStyle}>Enter your credentials to access your classroom</p>
        </div>

        {/* Messaging States */}
        {error && (
          <div className="alert-message alert-error">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert-message alert-success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <span>{success}</span>
          </div>
        )}

        {/* Authentication Form */}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <div className="input-container">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
              </span>
              <input
                id="email"
                type="email"
                className={`form-input ${error && !email ? "input-error" : ""}`}
                placeholder="student@masterlearning.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="form-group">
            <div style={labelRowStyle}>
              <label className="form-label" htmlFor="password">Password</label>
              <a href="#" style={forgotPasswordLinkStyle}>Forgot?</a>
            </div>
            <div className="input-container">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${error && !password ? "input-error" : ""}`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={showPasswordToggleStyle}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button type="submit" className="btn-gradient" style={submitBtnStyle} disabled={isLoading}>
            {isLoading ? (
              <span style={spinnerContainerStyle}>
                <span style={spinnerStyle}></span>
                Signing in...
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div style={footerStyle}>
          <p>
            New to MasterLearning?{" "}
            <Link href="/signup" style={linkStyle}>
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Page inline layouts - maximizing modern liquid glass design */
const containerStyle = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  position: "relative",
};

const cardStyle = {
  animation: "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
};

const headerStyle = {
  textAlign: "center",
  marginBottom: "32px",
};



const subtitleStyle = {
  fontSize: "0.9rem",
  color: "var(--foreground-muted)",
  lineHeight: "1.5",
};

const labelRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
};

const forgotPasswordLinkStyle = {
  fontSize: "0.8rem",
  color: "#fb923c",
  textDecoration: "none",
  fontWeight: "500",
  transition: "color 0.2s ease",
  marginBottom: "8px",
};

const showPasswordToggleStyle = {
  position: "absolute",
  right: "16px",
  background: "none",
  border: "none",
  color: "var(--foreground-muted)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  padding: "0",
  outline: "none",
  transition: "color 0.2s ease",
};

const submitBtnStyle = {
  marginTop: "8px",
  marginBottom: "24px",
};

const spinnerContainerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
};

const spinnerStyle = {
  width: "18px",
  height: "18px",
  border: "2.5px solid rgba(255,255,255,0.2)",
  borderTop: "2.5px solid #ffffff",
  borderRadius: "50%",
  animation: "spin 0.8s linear infinite",
};

const footerStyle = {
  textAlign: "center",
  fontSize: "0.9rem",
  color: "var(--foreground-muted)",
};

const linkStyle = {
  color: "#c084fc",
  fontWeight: "600",
  textDecoration: "none",
  transition: "color 0.2s ease",
  borderBottom: "1px solid transparent",
};
