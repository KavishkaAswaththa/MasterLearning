"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import { GraduationCap, PlayCircle, PlusCircle, Video } from "lucide-react";

export default function ClassroomPage() {
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
        <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Classroom...</div>
      </div>
    );
  }

  const liveClasses = [
    { id: "1", title: "Newtonian Physics Live Lesson", teacher: "Professor Davis", time: "Tomorrow, 9:00 AM", duration: "60 mins", link: "#" },
    { id: "2", title: "Trigonometry Masterclass", teacher: "Madame Nishadi", time: "July 16, 2:00 PM", duration: "45 mins", link: "#" }
  ];

  const recordingLessons = [
    { id: "rec_1", title: "Chapter 1: Intro to Gravitation", category: "Physics", views: "142 views", time: "3 days ago" },
    { id: "rec_2", title: "Chapter 3: Alkanes & Chemical Bonds", category: "Chemistry", views: "98 views", time: "1 week ago" },
    { id: "rec_3", title: "Chapter 2: Quadratic Equations Basics", category: "Mathematics", views: "210 views", time: "2 weeks ago" }
  ];

  return (
    <div className={styles.layout}>
      <div className="glow-purple" style={{ top: "10%", left: "20%" }}></div>
      <div className="glow-orange" style={{ bottom: "10%", right: "10%" }}></div>

      <Sidebar activeTab="classroom" />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.greetingSection}>
            <h1>Virtual Classroom</h1>
            <p>Access live webinars, study lecture streams, and video assignments.</p>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Live Webinars */}
            <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", border: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                <Video size={20} color="var(--color-orange)" /> Upcoming Live Lectures
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {liveClasses.map((item) => (
                  <div key={item.id} className="glass-panel-hover" style={{ padding: "1.2rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <h3 style={{ fontSize: "1rem", fontWeight: "bold", color: "#ffffff", marginBottom: "4px" }}>{item.title}</h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>Instructor: {item.teacher} | {item.duration}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--color-orange)" }}>{item.time}</span>
                      <button onClick={() => alert("Lecture stream is not yet live. Please try again at the scheduled time.")} className="gradient-button" style={{ padding: "8px 16px", fontSize: "0.85rem", borderRadius: "6px" }}>
                        Join Room
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Video Recordings */}
            <div className="glass-panel" style={{ padding: "2rem", border: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                <PlayCircle size={20} color="var(--color-purple)" /> Recorded Lectures Archive
              </h2>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1.2rem" }}>
                {recordingLessons.map((item) => (
                  <div key={item.id} className="glass-panel-hover" style={{ padding: "1.2rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", position: "relative" }}>
                    <div style={{ width: "100%", height: "120px", borderRadius: "8px", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(249, 115, 22, 0.2) 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <PlayCircle size={36} color="#ffffff" style={{ opacity: 0.8 }} />
                    </div>
                    <span style={{ fontSize: "0.75rem", fontWeight: "bold", textTransform: "uppercase", color: "var(--color-purple)", display: "block", marginBottom: "4px" }}>{item.category}</span>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#ffffff", marginBottom: "8px", lineHeight: "1.4" }}>{item.title}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                      <span>{item.views}</span>
                      <span>{item.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {user.role === "teacher" || user.role === "admin" ? (
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%)" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#ffffff" }}>Classroom Publisher</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Schedule live classroom sessions or record lectures.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={() => alert("Publisher classroom template loaded")} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "var(--primary)", border: "none", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                    <PlusCircle size={16} /> Schedule Live Lesson
                  </button>
                  <button onClick={() => alert("Lecture video upload panel loaded")} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                    <GraduationCap size={16} /> Upload Archive Video
                  </button>
                </div>
              </div>
            ) : null}

            <div className={styles.sideCard}>
              <h3 className={styles.sideCardTitle}>Classroom Rules</h3>
              <ul style={{ fontSize: "0.85rem", color: "var(--text-secondary)", paddingLeft: "15px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>Keep your microphone muted upon entering the classroom.</li>
                <li>Participate in lecture activities using Chat.</li>
                <li>Reach out to the teacher for direct math/science support.</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
