"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import styles from "../dashboard/page.module.css";

export default function TermsPage() {
  return (
    <div className={styles.layout} style={{ justifyContent: "center", alignItems: "center", minHeight: "100vh", padding: "2rem" }}>
      <div className="glow-purple" style={{ top: "10%", left: "10%" }}></div>
      <div className="glow-orange" style={{ bottom: "10%", right: "10%" }}></div>

      <div className="glass-panel" style={{ width: "100%", maxWidth: "800px", padding: "3rem", borderRadius: "24px", border: "1px solid var(--glass-border)", background: "rgba(15, 10, 30, 0.8)" }}>
        
        {/* Back Link */}
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--text-secondary)", fontSize: "0.9rem", textDecoration: "none", marginBottom: "2rem", transition: "color 0.2s ease" }} onMouseEnter={(e) => e.currentTarget.style.color = "#ffffff"} onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-secondary)"}>
          <ArrowLeft size={16} /> Back to Homepage
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(139,92,246,0.15)", color: "var(--color-purple)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Shield size={22} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>Terms of Service</h1>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2rem" }}>
          Welcome to MasterLearning. By accessing our platform, you agree to these clear and simple rules. Please read them carefully.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", textAlign: "left" }}>
          
          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>1. Account Creation & Security</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              You are responsible for keeping your login credentials safe. You agree to use the workspace strictly for educational purposes and to never share access with third parties.
            </p>
          </div>

          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>2. Acceptable Conduct</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              No cheating, scripting, or automated attempts to manipulate quiz results. All users must maintain professional and respectful behavior inside the virtual classroom chats.
            </p>
          </div>

          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>3. Intellectual Property</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              All uploaded study slides, lecture video stream recordings, chemistry/physics worksheets, and database logs belong to MasterLearning and our teachers. You may not distribute them.
            </p>
          </div>

          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>4. Account Limitation & Revocation</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              Administrators reserve the right to audit, modify, edit, or revoke user access profiles at any time for violation of the classroom code of conduct.
            </p>
          </div>

        </div>

        <div style={{ marginTop: "3rem", borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)", display: "flex", justifyContent: "space-between" }}>
          <span>Last Updated: July 18, 2026</span>
          <span>Version 1.1</span>
        </div>

      </div>
    </div>
  );
}
