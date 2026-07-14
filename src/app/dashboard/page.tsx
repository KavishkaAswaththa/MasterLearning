"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Sidebar from "@/components/Sidebar";
import ProfileSummary from "@/components/ProfileSummary";
import CourseCard, { CourseData } from "@/components/CourseCard";
import { 
  BookOpen, 
  GraduationCap, 
  Users, 
  ClipboardList, 
  Database,
  PlusCircle,
  Clock,
  TrendingUp
} from "lucide-react";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Role session state
  const [user] = useState<{ email: string; role: string; name: string } | null>(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : { email: "student@masterlearning.com", role: "student", name: "Kavishka Aswaththa" };
    }
    return null;
  });
  const [registeredUsers, setRegisteredUsers] = useState<{ name: string; email: string; role: string }[]>(() => {
    if (typeof window !== "undefined") {
      const storedReg = localStorage.getItem("registered_users");
      return storedReg ? JSON.parse(storedReg) : [];
    }
    return [];
  });

  // Admin: Delete registered user
  const handleDeleteUser = (emailToDelete: string) => {
    const updated = registeredUsers.filter(u => u.email !== emailToDelete);
    setRegisteredUsers(updated);
    localStorage.setItem("registered_users", JSON.stringify(updated));
  };

  const mockCourses: CourseData[] = [
    {
      id: "math-11",
      title: "Grade 11 Pure Mathematics",
      description: "Explore trigonometry, quadratic equations, and complex numbers with worksheets and online tests.",
      grade: "Grade 11",
      lessonsCount: 30,
      quizzesCount: 8,
      duration: "15",
      progress: 80,
      iconType: "math"
    },
    {
      id: "physics-11",
      title: "Grade 11 Newtonian Mechanics",
      description: "Master laws of motion, gravitation, energy, and momentum through video lectures and simulations.",
      grade: "Grade 11",
      lessonsCount: 24,
      quizzesCount: 6,
      duration: "12",
      progress: 65,
      iconType: "physics"
    },
    {
      id: "chemistry-11",
      title: "Grade 11 Organic Chemistry",
      description: "Understand carbon compounds, chemical bonding, and molecular interactions with interactive notes.",
      grade: "Grade 11",
      lessonsCount: 20,
      quizzesCount: 5,
      duration: "10",
      progress: 30,
      iconType: "chemistry"
    },
    {
      id: "it-11",
      title: "Grade 11 Programming Concepts",
      description: "An introduction to algorithms, variables, logic gates, and software engineering principles.",
      grade: "Grade 11",
      lessonsCount: 16,
      quizzesCount: 4,
      duration: "8",
      progress: 0,
      iconType: "it"
    },
    {
      id: "english-11",
      title: "Grade 11 English Literature",
      description: "Critical analysis of poetry, drama, and prose, with written assignments and vocab quizzes.",
      grade: "Grade 11",
      lessonsCount: 12,
      quizzesCount: 3,
      duration: "6",
      progress: 15,
      iconType: "english"
    }
  ];

  // Filtering Logic
  const filteredCourses = mockCourses.filter((course) => {
    // Category Filter
    if (filter === "science") {
      if (course.iconType !== "science" && course.iconType !== "physics" && course.iconType !== "chemistry") return false;
    } else if (filter === "math" && course.iconType !== "math") {
      return false;
    } else if (filter === "it" && course.iconType !== "it") {
      return false;
    }

    // Search Query Filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(query);
      const matchDesc = course.description.toLowerCase().includes(query);
      return matchTitle || matchDesc;
    }

    return true;
  });

  // Render Loading state
  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Profile workspace...</div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Background glow graphics */}
      <div className="glow-purple" style={{ top: "10%", left: "20%" }}></div>
      <div className="glow-orange" style={{ bottom: "10%", right: "10%" }}></div>

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className={styles.mainContent}>
        {/* Top Header Row */}
        <div className={styles.header}>
          <div className={styles.greetingSection}>
            <h1>Welcome back, {user.name}!</h1>
            <p>Role: <strong style={{ color: "var(--accent)" }}>{user.role.toUpperCase()}</strong> | Learning management dashboard workspace.</p>
          </div>

          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search dashboard context..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Dashboards */}

        {/* 1. STUDENT VIEW */}
        {user.role === "student" && (
          <div className={styles.dashboardGrid}>
            <div className={styles.leftColumn}>
              {/* Motivation banner */}
              <div className={styles.welcomeBanner}>
                <div className={styles.welcomeBannerText}>
                  <h2>Ready for a challenge?</h2>
                  <p>
                    You are only 550 XP away from reaching Level 13! Complete the remaining quizzes in Pure Mathematics to boost your score and unlock the &quot;Math Genius&quot; badge.
                  </p>
                  <div className={styles.statsRow}>
                    <div className={styles.bannerStat}>
                      <span className={styles.bannerStatVal}>7 Days</span>
                      <span className={styles.bannerStatLabel}>Study Streak</span>
                    </div>
                    <div className={styles.bannerStat}>
                      <span className={styles.bannerStatVal}>12 / 24</span>
                      <span className={styles.bannerStatLabel}>Modules Done</span>
                    </div>
                  </div>
                </div>

                <svg className={styles.welcomeIllustration} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>

              {/* Subject filtration controls */}
              <div className={styles.filterRow}>
                <h2 className={styles.sectionTitle}>
                  My Subjects <span className={styles.courseCountBadge}>{filteredCourses.length}</span>
                </h2>

                <div className={styles.filterTabs}>
                  {["all", "science", "math", "it"].map((cat) => (
                    <button
                      key={cat}
                      className={`${styles.filterTab} ${filter === cat ? styles.activeFilterTab : ""}`}
                      onClick={() => setFilter(cat)}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Courses card list */}
              {filteredCourses.length > 0 ? (
                <div className={styles.coursesGrid}>
                  {filteredCourses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>
              ) : (
                <div className="glass-panel" style={{ padding: "40px", textAlign: "center", color: "var(--text-secondary)" }}>
                  <p>No subjects match your search or filter criteria.</p>
                </div>
              )}
            </div>

            <div className={styles.rightColumn}>
              <ProfileSummary />

              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <h3 className={styles.sideCardTitle}>Upcoming Classroom Tasks</h3>
                  <span className={styles.viewAllLink}>View Calendar</span>
                </div>

                <div className={styles.scheduleList}>
                  {[
                    { title: "Physics: Chapter 4 Quiz", meta: "Due: Today, 11:59 PM (Assessment)", type: "orange" },
                    { title: "Organic Chemistry Live Class", meta: "Starts: Tomorrow, 10:00 AM (Classroom)", type: "purple" },
                    { title: "Maths: Trigonometry Worksheet", meta: "Due: July 15, 4:00 PM (Exercise)", type: "orange" }
                  ].map((task, i) => (
                    <div className={styles.scheduleItem} key={i}>
                      <div className={`${styles.scheduleIndicator} ${task.type === "purple" ? styles.indicatorPurple : styles.indicatorOrange}`}></div>
                      <div className={styles.scheduleDetails}>
                        <span className={styles.scheduleTitle}>{task.title}</span>
                        <span className={styles.scheduleMeta}>{task.meta}</span>
                      </div>
                      <div className={styles.playButtonIcon}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                          <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                        </svg>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. TEACHER VIEW */}
        {user.role === "teacher" && (
          <div className={styles.dashboardGrid}>
            <div className={styles.leftColumn}>
              {/* Teacher Summary Metrics */}
              <div className={styles.metricsRow} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-purple)" }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>142</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Active Students</p>
                  </div>
                </div>
                
                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(249, 115, 22, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-orange)" }}>
                    <BookOpen size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>5</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Assigned Classes</p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-purple)" }}>
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>88.4%</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Avg Quiz Score</p>
                  </div>
                </div>
              </div>

              {/* Submissions Section */}
              <div className="glass-panel" style={{ padding: "2rem", borderRadius: "24px", border: "1px solid var(--glass-border)", marginBottom: "2rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff" }}>Recent Quiz Submissions</h2>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-purple)", fontWeight: "bold", cursor: "pointer" }}>View All Logs</span>
                </div>
                
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "500px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        <th style={{ padding: "10px" }}>Student</th>
                        <th style={{ padding: "10px" }}>Quiz Subject</th>
                        <th style={{ padding: "10px" }}>Score</th>
                        <th style={{ padding: "10px" }}>Date</th>
                        <th style={{ padding: "10px" }}>Status</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "0.9rem" }}>
                      {[
                        { name: "Kavishka Aswaththa", subject: "Grade 10 Science Quiz", score: "90%", date: "Today, 4:12 PM", status: "Approved" },
                        { name: "Nishadi Perera", subject: "Grade 11 Pure Mathematics", score: "80%", date: "Today, 1:45 PM", status: "Approved" },
                        { name: "Tharushi Buddhika", subject: "Grade 11 Programming Concepts", score: "95%", date: "Yesterday, 3:30 PM", status: "Approved" },
                        { name: "Dilshan Mindika", subject: "Grade 10 Science Quiz", score: "70%", date: "July 12, 11:15 AM", status: "Approved" }
                      ].map((sub, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "12px 10px", fontWeight: "bold" }}>{sub.name}</td>
                          <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{sub.subject}</td>
                          <td style={{ padding: "12px 10px", color: "var(--color-orange)", fontWeight: "bold" }}>{sub.score}</td>
                          <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "0.8rem" }}>{sub.date}</td>
                          <td style={{ padding: "12px 10px" }}>
                            <span style={{ background: "rgba(34, 197, 94, 0.15)", color: "#22c55e", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold" }}>
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Course list managed */}
              <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1rem" }}>My Core Curriculum Channels</h2>
              <div className={styles.coursesGrid}>
                {mockCourses.slice(0, 3).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className={styles.rightColumn}>
              {/* Creator actions */}
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%)" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#ffffff" }}>Curriculum Creator Tools</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Generate live worksheets or add multi-choice questions.</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={() => alert("Quiz form template loaded")} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "var(--primary)", border: "none", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                    <PlusCircle size={16} /> Create New Quiz
                  </button>
                  <button onClick={() => alert("Lecture publisher workspace loaded")} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                    <GraduationCap size={16} /> Add Classroom Video
                  </button>
                </div>
              </div>

              {/* Schedule */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <h3 className={styles.sideCardTitle}>Lecture Scheduling</h3>
                </div>
                <div className={styles.scheduleList}>
                  <div className={styles.scheduleItem}>
                    <div className={`${styles.scheduleIndicator} ${styles.indicatorPurple}`}></div>
                    <div className={styles.scheduleDetails}>
                      <span className={styles.scheduleTitle}>Pure Mathematics: Live Q&A</span>
                      <span className={styles.scheduleMeta}>Starts: Tomorrow, 2:00 PM</span>
                    </div>
                  </div>
                  <div className={styles.scheduleItem}>
                    <div className={`${styles.scheduleIndicator} ${styles.indicatorOrange}`}></div>
                    <div className={styles.scheduleDetails}>
                      <span className={styles.scheduleTitle}>Newtonian Physics Live Lesson</span>
                      <span className={styles.scheduleMeta}>Starts: July 16, 9:00 AM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. ADMIN VIEW */}
        {user.role === "admin" && (
          <div className={styles.dashboardGrid}>
            <div className={styles.leftColumn}>
              {/* Admin Systems Stats */}
              <div className={styles.metricsRow} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-purple)" }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{registeredUsers.length + 3}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Registry Profiles</p>
                  </div>
                </div>
                
                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(249, 115, 22, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-orange)" }}>
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>100%</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Firebase Database Status</p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-purple)" }}>
                    <Clock size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>99.9%</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>System Uptime</p>
                  </div>
                </div>
              </div>

              {/* Accounts Directory */}
              <div className="glass-panel" style={{ padding: "2rem", borderRadius: "24px", border: "1px solid var(--glass-border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff" }}>User Registry Directory</h2>
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Seed accounts are protected</span>
                </div>

                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "500px" }}>
                    <thead>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                        <th style={{ padding: "10px" }}>Profile Name</th>
                        <th style={{ padding: "10px" }}>Email</th>
                        <th style={{ padding: "10px" }}>Role</th>
                        <th style={{ padding: "10px" }}>Status</th>
                        <th style={{ padding: "10px" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody style={{ fontSize: "0.9rem" }}>
                      {/* Seed Accounts */}
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "12px 10px", fontWeight: "bold" }}>Administrator</td>
                        <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>admin@masterlearning.com</td>
                        <td style={{ padding: "12px 10px" }}>
                          <span style={{ background: "rgba(139, 92, 246, 0.15)", color: "#a78bfa", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold" }}>
                            Admin
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px", color: "#22c55e" }}>Protected</td>
                        <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "0.8rem" }}>System Default</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "12px 10px", fontWeight: "bold" }}>Professor Davis</td>
                        <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>teacher@masterlearning.com</td>
                        <td style={{ padding: "12px 10px" }}>
                          <span style={{ background: "rgba(249, 115, 22, 0.15)", color: "#fb923c", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold" }}>
                            Teacher
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px", color: "#22c55e" }}>Protected</td>
                        <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "0.8rem" }}>System Default</td>
                      </tr>
                      <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                        <td style={{ padding: "12px 10px", fontWeight: "bold" }}>Kavishka Aswaththa</td>
                        <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>student@masterlearning.com</td>
                        <td style={{ padding: "12px 10px" }}>
                          <span style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60a5fa", padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold" }}>
                            Student
                          </span>
                        </td>
                        <td style={{ padding: "12px 10px", color: "#22c55e" }}>Protected</td>
                        <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "0.8rem" }}>System Default</td>
                      </tr>

                      {/* Registered Users */}
                      {registeredUsers.map((regUser, idx) => (
                        <tr key={idx} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "12px 10px", fontWeight: "bold" }}>{regUser.name}</td>
                          <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{regUser.email}</td>
                          <td style={{ padding: "12px 10px" }}>
                            <span style={{ 
                              background: regUser.role === "admin" ? "rgba(139, 92, 246, 0.15)" : regUser.role === "teacher" ? "rgba(249, 115, 22, 0.15)" : "rgba(59, 130, 246, 0.15)",
                              color: regUser.role === "admin" ? "#a78bfa" : regUser.role === "teacher" ? "#fb923c" : "#60a5fa", 
                              padding: "4px 8px", 
                              borderRadius: "6px", 
                              fontSize: "0.75rem", 
                              fontWeight: "bold" 
                            }}>
                              {regUser.role.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: "12px 10px", color: "var(--color-orange)" }}>Dynamic</td>
                          <td style={{ padding: "12px 10px" }}>
                            <button 
                              onClick={() => handleDeleteUser(regUser.email)}
                              style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.85rem", fontWeight: "bold", cursor: "pointer" }}
                            >
                              Revoke Access
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className={styles.rightColumn}>
              {/* Database Center */}
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%)" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#ffffff" }}>Admin Control Tools</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Trigger database sync and diagnostic utilities.</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={() => alert("Firebase data synced successfully.")} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "var(--primary)", border: "none", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                    <Database size={16} /> Sync Database Backup
                  </button>
                  <button onClick={() => alert("Audit log report successfully generated.")} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                    <ClipboardList size={16} /> Export Audit Logs
                  </button>
                </div>
              </div>

              {/* Activity Feed */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <h3 className={styles.sideCardTitle}>System Activity Stream</h3>
                </div>
                <div className={styles.scheduleList}>
                  <div className={styles.scheduleItem}>
                    <div className={`${styles.scheduleIndicator} ${styles.indicatorPurple}`}></div>
                    <div className={styles.scheduleDetails}>
                      <span className={styles.scheduleTitle}>Firebase Connection Established</span>
                      <span className={styles.scheduleMeta}>Database: Connected (Local Dev)</span>
                    </div>
                  </div>
                  <div className={styles.scheduleItem}>
                    <div className={`${styles.scheduleIndicator} ${styles.indicatorOrange}`}></div>
                    <div className={styles.scheduleDetails}>
                      <span className={styles.scheduleTitle}>Professor Davis logged in</span>
                      <span className={styles.scheduleMeta}>Session: Teacher workspace</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
