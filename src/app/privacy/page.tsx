"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import styles from "../dashboard/page.module.css";

export default function PrivacyPage() {
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
          <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(249,115,22,0.15)", color: "var(--color-orange)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lock size={22} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>Privacy Policy</h1>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2rem" }}>
          Your privacy is important to us. Here is a clear summary of how we store, use, and safeguard your account profiles and educational records.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", textAlign: "left" }}>
          
          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>1. Data We Collect</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              We collect your full name, email, role, and password credentials during user registrations, as well as quiz scores, timestamps, and active comments posted in classroom chat rooms.
            </p>
          </div>

          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>2. Database Storage</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              Your profile records are securely stored inside our Firebase Firestore database. If your connection drops, data is temporarily cached in your browser&apos;s local storage and synced automatically later.
            </p>
          </div>

          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>3. How We Use Information</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              We use your data solely to manage student dashboards, calculate average course progress scores, generate classroom calendars, and maintain portal security. We never sell your data.
            </p>
          </div>

          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>4. Security Auditing</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              Access to portal data is strictly limited. Administrators monitor system logs, verify connected databases, and deploy backup files to ensure information remains encrypted.
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
