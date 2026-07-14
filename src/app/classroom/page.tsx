"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import { GraduationCap, PlayCircle, PlusCircle, Video, X } from "lucide-react";

interface LiveClass {
  id: string;
  title: string;
  teacher: string;
  time: string;
  duration: string;
}

interface RecordedLesson {
  id: string;
  title: string;
  category: string;
  views: string;
  time: string;
}

export default function ClassroomPage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);

  // Classroom dynamic states
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([
    { id: "1", title: "Newtonian Physics Live Lesson", teacher: "Professor Davis", time: "Tomorrow, 9:00 AM", duration: "60 mins" },
    { id: "2", title: "Trigonometry Masterclass", teacher: "Madame Nishadi", time: "July 16, 2:00 PM", duration: "45 mins" }
  ]);

  const [recordingLessons, setRecordingLessons] = useState<RecordedLesson[]>([
    { id: "rec_1", title: "Chapter 1: Intro to Gravitation", category: "Physics", views: "142 views", time: "3 days ago" },
    { id: "rec_2", title: "Chapter 3: Alkanes & Chemical Bonds", category: "Chemistry", views: "98 views", time: "1 week ago" },
    { id: "rec_3", title: "Chapter 2: Quadratic Equations Basics", category: "Mathematics", views: "210 views", time: "2 weeks ago" }
  ]);

  // Modal flags
  const [activeStream, setActiveStream] = useState<{ title: string; teacher?: string; isLive: boolean } | null>(null);
  const [showCreateLiveModal, setShowCreateLiveModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Creation fields
  const [liveTitle, setLiveTitle] = useState("");
  const [liveTime, setLiveTime] = useState("Tomorrow, 2:00 PM");
  const [liveDuration, setLiveDuration] = useState("60 mins");

  const [videoTitle, setVideoTitle] = useState("");
  const [videoCategory, setVideoCategory] = useState("Science");

  // Chat stream
  const [chatMessages, setChatMessages] = useState<{ user: string; text: string }[]>([]);
  const [chatInput, setChatInput] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login?error=auth_required";
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));

    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "upload") {
      setShowUploadModal(true);
    } else if (params.get("action") === "schedule") {
      setShowCreateLiveModal(true);
    }
  }, []);

  const handleCreateLive = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveTitle.trim()) return;
    const newClass: LiveClass = {
      id: String(Date.now()),
      title: liveTitle,
      teacher: user ? user.name : "Instructor",
      time: liveTime,
      duration: liveDuration
    };
    setLiveClasses([newClass, ...liveClasses]);
    setShowCreateLiveModal(false);
    setLiveTitle("");
    showToast("Live lecture scheduled successfully!", "success");
  };

  const handleUploadVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) return;
    const newVideo: RecordedLesson = {
      id: String(Date.now()),
      title: videoTitle,
      category: videoCategory,
      views: "0 views",
      time: "Just now"
    };
    setRecordingLessons([newVideo, ...recordingLessons]);
    setShowUploadModal(false);
    setVideoTitle("");
    showToast("Archive video uploaded successfully!", "success");
  };

  const handleJoinRoom = (title: string, teacher: string) => {
    setActiveStream({ title, teacher, isLive: true });
    setChatMessages([
      { user: teacher, text: "Hello class! Welcome to our live room simulator." },
      { user: "System", text: "You joined the class stream lobby." }
    ]);
  };

  const handlePlayRecording = (title: string) => {
    setActiveStream({ title, isLive: false });
    setChatMessages([
      { user: "System", text: "Playing archived lecture recording." }
    ]);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages([...chatMessages, { user: user ? user.name : "Student", text: chatInput }]);
    setChatInput("");
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Classroom...</div>
      </div>
    );
  }

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
                      <button onClick={() => handleJoinRoom(item.title, item.teacher)} className="gradient-button" style={{ padding: "8px 16px", fontSize: "0.85rem", borderRadius: "6px" }}>
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
                  <div key={item.id} onClick={() => handlePlayRecording(item.title)} className="glass-panel-hover" style={{ padding: "1.2rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", position: "relative", cursor: "pointer" }}>
                    <div style={{ width: "100%", height: "120px", borderRadius: "8px", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(249, 115, 22, 0.15) 100%)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "12px", border: "1px solid rgba(255,255,255,0.05)" }}>
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
                  <button onClick={() => setShowCreateLiveModal(true)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "var(--primary)", border: "none", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                    <PlusCircle size={16} /> Schedule Live Lesson
                  </button>
                  <button onClick={() => setShowUploadModal(true)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
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

      {/* Stream Viewer Modal Overlay */}
      {activeStream && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "1.5rem" }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "900px", border: "1px solid var(--glass-border)", padding: "1.5rem", borderRadius: "20px", display: "grid", gridTemplateColumns: "1.8fr 1fr", gap: "1.5rem", height: "550px" }}>
            
            {/* Player Frame */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
              <div style={{ position: "relative", width: "100%", flexGrow: 1, borderRadius: "12px", background: "radial-gradient(circle, #2e1065 0%, #090514 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", border: "1px solid rgba(255,255,255,0.08)", overflow: "hidden" }}>
                
                {/* Simulated live video stream visual */}
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: activeStream.isLive ? "rgba(249,115,22,0.15)" : "rgba(139,92,246,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1rem" }}>
                  <PlayCircle size={40} color={activeStream.isLive ? "var(--color-orange)" : "var(--color-purple)"} />
                </div>
                
                <h3 style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#ffffff", textAlign: "center", padding: "0 1rem" }}>{activeStream.title}</h3>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)", marginTop: "6px" }}>
                  {activeStream.isLive ? "🎥 Stream Active | Live Broadcast Simulator" : "🍿 Playing Lecture Archive Recording"}
                </p>
                
                {activeStream.isLive && (
                  <span style={{ position: "absolute", top: "15px", left: "15px", background: "#ef4444", color: "#ffffff", padding: "4px 8px", borderRadius: "4px", fontSize: "0.7rem", fontWeight: "bold", textTransform: "uppercase" }}>
                    Live
                  </span>
                )}
              </div>
              <div style={{ padding: "10px 0 0 0" }}>
                <h4 style={{ color: "#ffffff", fontSize: "1rem", fontWeight: "bold" }}>{activeStream.title}</h4>
                {activeStream.teacher && <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Instructor: {activeStream.teacher}</p>}
              </div>
            </div>

            {/* Chat Frame */}
            <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "12px", padding: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(255,255,255,0.06)", paddingBottom: "8px", marginBottom: "10px" }}>
                <h3 style={{ fontSize: "0.95rem", fontWeight: "bold", color: "#ffffff" }}>Live Room Chat</h3>
                <button onClick={() => setActiveStream(null)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <X size={18} />
                </button>
              </div>

              {/* Messages viewport */}
              <div style={{ flexGrow: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: "10px", paddingRight: "5px", fontSize: "0.85rem" }}>
                {chatMessages.map((msg, idx) => (
                  <div key={idx} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "6px", padding: "6px 10px" }}>
                    <strong style={{ color: msg.user === "System" ? "#a78bfa" : "var(--color-orange)", display: "block", fontSize: "0.78rem" }}>{msg.user}</strong>
                    <span style={{ color: "#ffffff", marginTop: "2px", display: "block" }}>{msg.text}</span>
                  </div>
                ))}
              </div>

              {/* Message Composer */}
              <form onSubmit={handleSendChat} style={{ display: "flex", gap: "6px", marginTop: "10px" }}>
                <input 
                  type="text" 
                  value={chatInput} 
                  onChange={(e) => setChatInput(e.target.value)} 
                  placeholder={activeStream.isLive ? "Ask a question..." : "Chat disabled for archive"}
                  disabled={!activeStream.isLive}
                  style={{ flexGrow: 1, padding: "8px 12px", borderRadius: "6px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", fontSize: "0.85rem", outline: "none" }} 
                />
                <button type="submit" disabled={!activeStream.isLive} className="gradient-button" style={{ padding: "8px 12px", borderRadius: "6px", fontSize: "0.85rem" }}>Send</button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* Schedule Live Modal */}
      {showCreateLiveModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
          <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "400px", border: "1px solid var(--glass-border)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5rem" }}>Schedule Live Lecture</h2>
            <form onSubmit={handleCreateLive} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Lecture Title</label>
                <input type="text" required placeholder="e.g. Alkanes & Chemical Bonds" value={liveTitle} onChange={(e) => setLiveTitle(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Scheduled Time</label>
                <input type="text" required value={liveTime} onChange={(e) => setLiveTime(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Duration</label>
                <input type="text" required value={liveDuration} onChange={(e) => setLiveDuration(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowCreateLiveModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className="gradient-button" style={{ padding: "8px 16px", borderRadius: "6px" }}>Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Upload Archive Modal */}
      {showUploadModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
          <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "400px", border: "1px solid var(--glass-border)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5rem" }}>Upload Lecture Recording</h2>
            <form onSubmit={handleUploadVideo} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Video Title</label>
                <input type="text" required placeholder="e.g. Chapter 4: Quadratic Equations" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Subject Category</label>
                <select value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(25,18,50,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }}>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Information Technology">Information Technology</option>
                </select>
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowUploadModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className="gradient-button" style={{ padding: "8px 16px", borderRadius: "6px" }}>Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}

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

    </div>
  );
}
