"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const consent = localStorage.getItem("cookie-consent");
      if (!consent) {
        // Show after a slight delay for smooth introduction
        const timer = setTimeout(() => {
          setShowBanner(true);
        }, 1500);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleConsent = (decision: "granted" | "declined") => {
    if (typeof window !== "undefined") {
      localStorage.setItem("cookie-consent", decision);
      setShowBanner(false);
    }
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: "24px",
      left: "24px",
      right: "24px",
      maxWidth: "500px",
      margin: "0 auto",
      background: "rgba(15, 10, 30, 0.85)",
      backdropFilter: "blur(16px)",
      border: "1px solid var(--glass-border)",
      borderRadius: "18px",
      padding: "1.5rem",
      boxShadow: "0 10px 40px rgba(0,0,0,0.6), inset 0 0 20px rgba(255,255,255,0.05)",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "1rem",
      animation: "cookieSlideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards"
    }}>
      <style>{`
        @keyframes cookieSlideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
      
      <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
        <div style={{
          width: "42px",
          height: "42px",
          borderRadius: "12px",
          background: "rgba(249, 115, 22, 0.15)",
          color: "var(--color-orange)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0
        }}>
          <Cookie size={20} />
        </div>
        <div style={{ textAlign: "left" }}>
          <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: "bold", margin: "0 0 4px 0" }}>We value your privacy</h4>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.82rem", lineHeight: "1.4", margin: 0 }}>
            We use cookies to save your login session and track your custom learning metrics. Read our <Link href="/cookies" style={{ color: "var(--color-purple)", textDecoration: "underline" }}>Cookie Policy</Link> to learn more.
          </p>
        </div>
      </div>

      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "4px" }}>
        <button
          onClick={() => handleConsent("declined")}
          style={{
            background: "none",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text-secondary)",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "0.8rem",
            cursor: "pointer",
            fontWeight: "bold",
            transition: "all 0.2s ease"
          }}
        >
          Disagree
        </button>
        <button
          onClick={() => handleConsent("granted")}
          className="gradient-button"
          style={{
            padding: "8px 20px",
            borderRadius: "8px",
            fontSize: "0.8rem",
            fontWeight: "bold",
            cursor: "pointer",
            border: "none",
            color: "#ffffff"
          }}
        >
          Agree & Accept
        </button>
      </div>
    </div>
  );
}
