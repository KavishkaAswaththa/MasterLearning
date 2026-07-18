"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Cookie } from "lucide-react";
import styles from "../dashboard/page.module.css";

export default function CookiesPage() {
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
            <Cookie size={22} />
          </div>
          <h1 style={{ fontSize: "2rem", fontWeight: "800", color: "#ffffff", margin: 0 }}>Cookie Policy</h1>
        </div>

        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: "1.6", marginBottom: "2rem" }}>
          We use cookies and local browser tables to provide a smooth, fast, and personalized workspace experience. Read on to learn more.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "2rem", textAlign: "left" }}>
          
          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>1. What Are Cookies?</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              Cookies are small text files stored on your device when you load websites. In this platform, we utilize browser local storage alongside local cookie headers to remember your active login state.
            </p>
          </div>

          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>2. Essential Cookies</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              These are required for core features like authenticating teacher credentials or restricting guest access from taking active classroom tests. If disabled, you will be logged out of your workspace.
            </p>
          </div>

          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>3. Analytics & Progress Tracking</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              We use cached progress states to map math and science learning curves, populate your dashboard progress grids, and animate course metrics in real-time.
            </p>
          </div>

          <div>
            <h3 style={{ color: "#ffffff", fontSize: "1.15rem", fontWeight: "700", marginBottom: "8px" }}>4. Managing Consent</h3>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", lineHeight: "1.6", margin: 0 }}>
              You can grant or decline cookies at any time via the cookie banner at the bottom of the portal. You can also clear your browser history/localStorage cache to reset all consent permissions.
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
