"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import { Save, Lock, User, Bell } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [notifications, setNotifications] = useState(true);

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.replace("/login?error=auth_required");
      return;
    }
    const parsed = JSON.parse(storedUser);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(parsed);
    setDisplayName(parsed.name);
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const updatedUser = { ...user, name: displayName };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    showToast("Profile settings saved successfully!", "success");
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }
    if (password.length < 6) {
      showToast("Password must be at least 6 characters long.", "error");
      return;
    }
    showToast("Password updated successfully!", "success");
    setPassword("");
    setConfirmPassword("");
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Settings...</div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className="glow-purple" style={{ top: "10%", left: "20%" }}></div>
      <div className="glow-orange" style={{ bottom: "10%", right: "10%" }}></div>

      <Sidebar activeTab="settings" />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.greetingSection}>
            <h1>Account Settings</h1>
            <p>Modify display preferences, reset credentials, and customize email parameters.</p>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* General Profile Settings */}
            <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", border: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                <User size={20} color="var(--color-orange)" /> General Profile
              </h2>

              <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Registered Email Address</label>
                  <input
                    type="email"
                    value={user.email}
                    disabled
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", color: "var(--text-muted)", cursor: "not-allowed", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Display Name</label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none", transition: "border-color 0.2s" }}
                  />
                </div>

                <button type="submit" className="gradient-button" style={{ display: "inline-flex", width: "fit-content", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                  <Save size={16} /> Save Changes
                </button>
              </form>
            </div>

            {/* Change Password */}
            <div className="glass-panel" style={{ padding: "2rem", border: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                <Lock size={20} color="var(--color-purple)" /> Reset Password
              </h2>

              <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }}
                  />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "10px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }}
                  />
                </div>

                <button type="submit" className="gradient-button" style={{ display: "inline-flex", width: "fit-content", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                  <Lock size={16} /> Update Password
                </button>
              </form>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            <div className={styles.sideCard}>
              <h3 className={styles.sideCardTitle} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Bell size={16} color="var(--color-orange)" /> Notification Settings
              </h3>
              <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>
                Choose if you want to receive classroom announcements via email.
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <input
                  type="checkbox"
                  id="notif_check"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  style={{ width: "18px", height: "18px", accentColor: "var(--color-purple)", cursor: "pointer" }}
                />
                <label htmlFor="notif_check" style={{ fontSize: "0.9rem", color: "#ffffff", cursor: "pointer" }}>Receive Email Alerts</label>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Glassmorphic Toast Notification */}
        {toast && (
          <div style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "rgba(15, 10, 30, 0.9)",
            backdropFilter: "blur(12px)",
            border: "1px solid var(--glass-border)",
            padding: "1rem 1.5rem",
            borderRadius: "12px",
            color: "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.05)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            zIndex: 2000,
            animation: "slideIn 0.3s ease forwards"
          }}>
            <div style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: toast.type === "success" ? "#22c55e" : toast.type === "error" ? "#ef4444" : "var(--color-orange)"
            }}></div>
            <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{toast.message}</span>
          </div>
        )}

      </main>
    </div>
  );
}
