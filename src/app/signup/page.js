"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, getUsersRegistry } from "@/lib/db";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [role, setRole] = useState("student");

  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    label: "None",
    color: "rgba(255,255,255,0.2)",
    checks: {
      minLen: false,
      upper: false,
      numSym: false
    }
  });

  const isEmailValid = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  const handlePasswordChange = (val) => {
    setPassword(val);
    const minLen = val.length >= 6;
    const upper = /[A-Z]/.test(val);
    const numSym = /[0-9!@#$%^&*(),.?":{}|<>]/.test(val);
    
    let score = 0;
    if (val.length > 0) {
      if (minLen) score++;
      if (upper) score++;
      if (numSym) score++;
    }
    
    let label = "None";
    let color = "rgba(255,255,255,0.2)";
    if (val.length > 0) {
      if (score === 1) {
        label = "Weak";
        color = "#f87171"; // Light red
      } else if (score === 2) {
        label = "Medium";
        color = "#fb923c"; // Light orange
      } else if (score === 3) {
        label = "Strong";
        color = "#4ade80"; // Light green
      }
    }
    
    setPasswordStrength({
      score,
      label,
      color,
      checks: { minLen, upper, numSym }
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Form Valdiation
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (!isEmailValid(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (passwordStrength.score < 2) {
      setError("Please choose a stronger password (must meet at least 2 strength requirements).");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setIsLoading(true);

    try {
      const emailLower = email.toLowerCase().trim();
      const registry = await getUsersRegistry();
      const userExists = registry.some((u) => u.email.toLowerCase() === emailLower) ||
        emailLower === "admin@masterlearning.com" ||
        emailLower === "teacher@masterlearning.com" ||
        emailLower === "student@masterlearning.com";

      if (userExists) {
        throw new Error("User already exists");
      }

      await registerUser({ name, email, password, role });
      
      setSuccess("Account created successfully! Redirecting to login...");
      
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1000);
    } catch (err) {
      setError(err.message === "User already exists" ? "This email is already in use. Please sign in." : "Registration failed. Please try again.");
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
          <h1 style={titleStyle}>
            Create your <span className="gradient-text">Account</span>
          </h1>
          <p style={subtitleStyle}>Join MasterLearning to start your educational journey</p>
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

        {/* Signup Form */}
        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="input-container">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              </span>
              <input
                id="name"
                type="text"
                className={`form-input ${error && !name ? "input-error" : ""}`}
                placeholder="Tharushi Buddhika"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>

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
                className={`form-input ${error && (!email || !isEmailValid(email)) ? "input-error" : ""}`}
                placeholder="student@masterlearning.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {email.length > 0 && !isEmailValid(email) && (
              <span style={{ fontSize: "0.72rem", color: "#f87171", marginTop: "4px" }}>
                Please enter a valid email format (e.g. name@example.com)
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
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
                className={`form-input ${error && (!password || passwordStrength.score < 2) ? "input-error" : ""}`}
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
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
            {password.length > 0 && (
              <div style={{ marginTop: "10px", width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--foreground-muted)" }}>Password Strength:</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: passwordStrength.color }}>
                    {passwordStrength.label}
                  </span>
                </div>
                
                <div style={{ display: "flex", gap: "4px", width: "100%", height: "4px" }}>
                  {[1, 2, 3].map((step) => (
                    <div
                      key={step}
                      style={{
                        flex: 1,
                        height: "100%",
                        borderRadius: "2px",
                        backgroundColor: step <= passwordStrength.score ? passwordStrength.color : "rgba(255,255,255,0.06)",
                        transition: "background-color 0.3s ease"
                      }}
                    />
                  ))}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: passwordStrength.checks.minLen ? "#4ade80" : "var(--foreground-muted)" }}>
                    <span>{passwordStrength.checks.minLen ? "✓" : "○"}</span>
                    <span>At least 6 characters</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: passwordStrength.checks.upper ? "#4ade80" : "var(--foreground-muted)" }}>
                    <span>{passwordStrength.checks.upper ? "✓" : "○"}</span>
                    <span>Contains an uppercase letter</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: passwordStrength.checks.numSym ? "#4ade80" : "var(--foreground-muted)" }}>
                    <span>{passwordStrength.checks.numSym ? "✓" : "○"}</span>
                    <span>Contains a number or symbol</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-container">
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
              </span>
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                className={`form-input ${error && password !== confirmPassword ? "input-error" : ""}`}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            {confirmPassword.length > 0 && (
              <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: password === confirmPassword ? "#4ade80" : "#f87171" }}>
                <span>{password === confirmPassword ? "✓" : "✗"}</span>
                <span>{password === confirmPassword ? "Passwords match" : "Passwords do not match"}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">Account Role</label>
            <div className="input-container" style={{ position: "relative" }}>
              <span className="input-icon">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </span>
              <select
                id="role"
                className="form-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                disabled={isLoading}
                style={{
                  appearance: "none",
                  WebkitAppearance: "none",
                  paddingRight: "2.5rem",
                  cursor: "pointer",
                  background: "rgba(255, 255, 255, 0.03)",
                  width: "100%"
                }}
              >
                <option value="student" style={{ backgroundColor: "#130e26", color: "#ffffff" }}>Student</option>
                <option value="teacher" style={{ backgroundColor: "#130e26", color: "#ffffff" }}>Teacher</option>
                <option value="admin" style={{ backgroundColor: "#130e26", color: "#ffffff" }}>Administrator</option>
              </select>
              <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: "var(--foreground-muted)" }}>▼</span>
            </div>
          </div>

          <button type="submit" className="btn-gradient" style={submitBtnStyle} disabled={isLoading}>
            {isLoading ? (
              <span style={spinnerContainerStyle}>
                <span style={spinnerStyle}></span>
                Registering...
              </span>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div style={footerStyle}>
          <p>
            Already have an account?{" "}
            <Link href="/login" style={linkStyle}>
              Sign In
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



const titleStyle = {
  fontSize: "1.6rem",
  fontWeight: "800",
  marginBottom: "8px",
  letterSpacing: "-0.02em",
  color: "#ffffff",
};

const subtitleStyle = {
  fontSize: "0.9rem",
  color: "var(--foreground-muted)",
  lineHeight: "1.5",
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
