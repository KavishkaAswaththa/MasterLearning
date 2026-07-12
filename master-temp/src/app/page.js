"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div style={containerStyle}>
      {/* Background radial glow */}
      <div className="portal-bg"></div>

      <div className="glass-card" style={heroCardStyle}>
        {/* Logo/Icon */}
        <div style={logoContainerStyle}>
          <span style={logoTextStyle}>ML</span>
        </div>

        {/* Project Meta */}
        <h1 style={mainTitleStyle}>
          Welcome to <span className="gradient-text">MasterLearning</span>
        </h1>
        <p style={subTitleStyle}>
          A scalable, cloud-native e-learning solution built for modern virtual education.
        </p>

        {/* Features Grid */}
        <div style={gridStyle}>
          <div style={gridItemStyle}>
            <span style={gridIconStyle}>⚡</span>
            <h3 style={gridTitleStyle}>10K+ Concurrent</h3>
            <p style={gridDescStyle}>Designed to scale automatically to demand</p>
          </div>
          <div style={gridItemStyle}>
            <span style={gridIconStyle}>📺</span>
            <h3 style={gridTitleStyle}>Video Streaming</h3>
            <p style={gridDescStyle}>High-quality on-demand lessons delivery</p>
          </div>
          <div style={gridItemStyle}>
            <span style={gridIconStyle}>📝</span>
            <h3 style={gridTitleStyle}>Assessments</h3>
            <p style={gridDescStyle}>Real-time exams & instant grading systems</p>
          </div>
          <div style={gridItemStyle}>
            <span style={gridIconStyle}>🛡️</span>
            <h3 style={gridTitleStyle}>Secure Data</h3>
            <p style={gridDescStyle}>Role-based security & student info tracking</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={buttonContainerStyle}>
          <Link href="/login" className="btn-gradient" style={actionBtnStyle}>
            Sign In to Classroom
          </Link>
          
          <Link href="/signup" style={secondaryBtnStyle}>
            Create Student Account
          </Link>
        </div>

        {/* Individual Task Map - Collaborative Help */}
        <div style={collaborativeSectionStyle}>
          <h4 style={collaborativeTitleStyle}>🔑 Mini-Hackathon Portal</h4>
          <div style={tagsContainerStyle}>
            <span style={tagStyle}>
              <strong>Tharushi:</strong> Auth (/login, /signup)
            </span>
            <span style={tagDisabledStyle}>
              <strong>Nishadi:</strong> Dashboard (/dashboard)
            </span>
            <span style={tagDisabledStyle}>
              <strong>Gamidu:</strong> Classroom (/classroom)
            </span>
            <span style={tagDisabledStyle}>
              <strong>Dilhara:</strong> Quiz (/quiz)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Page Inline Styles */
const containerStyle = {
  minHeight: "100vh",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "24px",
  position: "relative",
};

const heroCardStyle = {
  maxWidth: "600px",
  textAlign: "center",
  animation: "fade-up 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
};

const logoContainerStyle = {
  width: "64px",
  height: "64px",
  borderRadius: "20px",
  background: "linear-gradient(135deg, #a855f7 0%, #f97316 100%)",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto 24px auto",
  boxShadow: "0 0 25px rgba(168, 85, 247, 0.4)",
};

const logoTextStyle = {
  fontSize: "1.6rem",
  fontWeight: "800",
  color: "#ffffff",
  letterSpacing: "-0.05em",
};

const mainTitleStyle = {
  fontSize: "2.2rem",
  fontWeight: "800",
  marginBottom: "12px",
  letterSpacing: "-0.02em",
  color: "#ffffff",
};

const subTitleStyle = {
  fontSize: "1rem",
  color: "var(--foreground-muted)",
  lineHeight: "1.6",
  marginBottom: "36px",
  maxWidth: "480px",
  marginLeft: "auto",
  marginRight: "auto",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(2, 1fr)",
  gap: "16px",
  marginBottom: "36px",
};

const gridItemStyle = {
  background: "rgba(255, 255, 255, 0.015)",
  border: "1px solid rgba(255, 255, 255, 0.04)",
  borderRadius: "16px",
  padding: "16px",
  textAlign: "left",
};

const gridIconStyle = {
  fontSize: "1.4rem",
  display: "block",
  marginBottom: "8px",
};

const gridTitleStyle = {
  fontSize: "0.95rem",
  fontWeight: "700",
  color: "#ffffff",
  marginBottom: "4px",
};

const gridDescStyle = {
  fontSize: "0.8rem",
  color: "var(--foreground-muted)",
  lineHeight: "1.4",
};

const buttonContainerStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginBottom: "36px",
};

const actionBtnStyle = {
  textDecoration: "none",
  textAlign: "center",
};

const secondaryBtnStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "14px 28px",
  background: "rgba(255, 255, 255, 0.03)",
  border: "1px solid var(--glass-border)",
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "1rem",
  fontWeight: "600",
  textDecoration: "none",
  cursor: "pointer",
  transition: "all 0.3s ease",
};

const collaborativeSectionStyle = {
  borderTop: "1px solid rgba(255, 255, 255, 0.06)",
  paddingTop: "24px",
  textAlign: "left",
};

const collaborativeTitleStyle = {
  fontSize: "0.85rem",
  fontWeight: "700",
  color: "var(--foreground-muted)",
  marginBottom: "12px",
  textTransform: "uppercase",
  letterSpacing: "0.05em",
};

const tagsContainerStyle = {
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
};

const tagStyle = {
  background: "rgba(168, 85, 247, 0.15)",
  border: "1px solid rgba(168, 85, 247, 0.3)",
  color: "#c084fc",
  fontSize: "0.75rem",
  padding: "6px 12px",
  borderRadius: "20px",
  fontWeight: "500",
};

const tagDisabledStyle = {
  background: "rgba(255, 255, 255, 0.02)",
  border: "1px solid rgba(255, 255, 255, 0.05)",
  color: "var(--foreground-muted)",
  fontSize: "0.75rem",
  padding: "6px 12px",
  borderRadius: "20px",
  fontWeight: "500",
};
