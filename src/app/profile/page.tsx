"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import ProfileSummary from "@/components/ProfileSummary";
import { Award, Calendar, Shield } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login?error=auth_required";
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));
  }, []);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Profile...</div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className="glow-purple" style={{ top: "10%", left: "20%" }}></div>
      <div className="glow-orange" style={{ bottom: "10%", right: "10%" }}></div>

      <Sidebar activeTab="profile" />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.greetingSection}>
            <h1>My Profile Workspace</h1>
            <p>Manage your account settings, scores, and active classroom tracks.</p>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Profile Overview Card */}
            <div className="glass-panel" style={{ padding: "2.5rem", marginBottom: "2rem", border: "1px solid var(--glass-border)", display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
              <div style={{ width: "90px", height: "90px", borderRadius: "24px", background: "var(--gradient-primary)", display: "flex", alignItems: "center", justifyContent: "center", color: "#ffffff", fontSize: "2.5rem", fontWeight: "800", boxShadow: "0 8px 24px rgba(139,92,246,0.3)" }}>
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 style={{ fontSize: "1.5rem", fontWeight: "800", color: "#ffffff", marginBottom: "6px" }}>{user.name}</h2>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "0.85rem", background: "rgba(139,92,246,0.15)", color: "#a78bfa", padding: "4px 10px", borderRadius: "6px", fontWeight: "bold", textTransform: "uppercase" }}>
                    {user.role}
                  </span>
                  <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{user.email}</span>
                </div>
              </div>
            </div>

            {/* Profile Achievements */}
            <div className="glass-panel" style={{ padding: "2rem", border: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                <Award size={20} color="var(--color-orange)" /> My Badges & Milestones
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
                {[
                  { title: "First Ascent", desc: "Completed your first diagnostic quiz.", unlock: "Unlocked", active: true },
                  { title: "Math Prodigy", desc: "Scored 85% or higher on an Algebra Quiz.", unlock: "Unlocked", active: true },
                  { title: "Study Streaker", desc: "Maintain a study streak for 7 consecutive days.", unlock: "Unlocked", active: true },
                  { title: "Classroom Guru", desc: "Attended 5 live lessons.", unlock: "Locked", active: false }
                ].map((item, i) => (
                  <div key={i} className="glass-panel-hover" style={{ padding: "1.2rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.04)", background: item.active ? "rgba(255,255,255,0.01)" : "rgba(255,255,255,0.002)", opacity: item.active ? 1 : 0.5 }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "bold", color: item.active ? "#ffffff" : "var(--text-muted)", marginBottom: "4px" }}>{item.title}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginBottom: "8px", minHeight: "36px" }}>{item.desc}</p>
                    <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: item.active ? "var(--color-orange)" : "var(--text-muted)" }}>{item.unlock}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {user.role === "student" && <ProfileSummary />}

            <div className={styles.sideCard}>
              <h3 className={styles.sideCardTitle} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Shield size={16} color="var(--color-purple)" /> Security & Access
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1rem" }}>
                Your account is protected under school portal directories. Use Settings to change password credentials.
              </p>
              <div style={{ display: "flex", gap: "6px", fontSize: "0.75rem", color: "var(--text-muted)", alignItems: "center" }}>
                <Calendar size={14} /> Created: July 14, 2026
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
