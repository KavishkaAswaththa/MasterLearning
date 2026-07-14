"use client";

import React, { useState, useEffect } from "react";
import styles from "./page.module.css";
import { getUsersRegistry, getRecentSubmissions, QuizSubmission } from "@/lib/db";
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
  TrendingUp,
  X
} from "lucide-react";

export default function Dashboard() {

  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Role session state
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<{ name: string; email: string; role: string }[]>([]);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);
  
  // Selected course syllabus overlay details state
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

  // Simulated actions state
  const [backupStatus, setBackupStatus] = useState("idle"); // idle, backing_up, done
  const [exportStatus, setExportStatus] = useState("idle"); // idle, exporting, done

  const handleBackup = () => {
    setBackupStatus("backing_up");
    setTimeout(() => {
      setBackupStatus("done");
      setTimeout(() => setBackupStatus("idle"), 3000);
    }, 2000);
  };

  const handleExport = () => {
    setExportStatus("exporting");
    setTimeout(() => {
      setExportStatus("done");
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob(["Email,Name,Role\nstudent@masterlearning.com,Kavishka Aswaththa,student\nteacher@masterlearning.com,Professor Davis,teacher"], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = "masterlearning_student_report.csv";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setTimeout(() => setExportStatus("idle"), 3000);
    }, 2000);
  };



  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login?error=auth_required";
      return;
    }

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));

    getUsersRegistry().then((list) => {
      setRegisteredUsers(list);
    });

    getRecentSubmissions().then((list) => {
      setSubmissions(list);
    });
  }, []);



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

  // Admin unified accounts lists
  const seedUsers = [
    { name: "Administrator", email: "admin@masterlearning.com", role: "admin", status: "Protected" },
    { name: "Professor Davis", email: "teacher@masterlearning.com", role: "teacher", status: "Protected" },
    { name: "Kavishka Aswaththa", email: "student@masterlearning.com", role: "student", status: "Protected" }
  ];

  const allUsersList = [
    ...seedUsers,
    ...registeredUsers.map(u => ({ ...u, status: "Dynamic" }))
  ];



  // Calculate logged-in student statistics
  const mySubmissions = submissions.filter(sub => sub.email.toLowerCase() === (user ? user.email.toLowerCase() : ""));
  const myAverageGrade = mySubmissions.length > 0
    ? (mySubmissions.reduce((acc, curr) => {
        const val = parseFloat(curr.score.replace("%", ""));
        return acc + (isNaN(val) ? 0 : val);
      }, 0) / mySubmissions.length).toFixed(0) + "%"
    : "N/A";

  const studentsCount = allUsersList.filter(u => u.role === "student").length;
  const teachersCount = allUsersList.filter(u => u.role === "teacher").length;

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

      <Sidebar activeTab="dashboard" />

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
                    You have finished {mySubmissions.length} quiz assessments with an average score of {myAverageGrade}! Review your logs below or start new courses to boost your score rank.
                  </p>
                  <div className={styles.statsRow}>
                    <div className={styles.bannerStat}>
                      <span className={styles.bannerStatVal}>{mySubmissions.length} Done</span>
                      <span className={styles.bannerStatLabel}>Quizzes Finished</span>
                    </div>
                    <div className={styles.bannerStat}>
                      <span className={styles.bannerStatVal}>{myAverageGrade}</span>
                      <span className={styles.bannerStatLabel}>Average Grade</span>
                    </div>
                  </div>
                </div>

                <svg className={styles.welcomeIllustration} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5" />
                </svg>
              </div>

              {/* Learning Progress Analytics */}
              <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", border: "1px solid var(--glass-border)" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                  <TrendingUp size={20} color="var(--color-purple)" /> Weekly Study Hours
                </h2>
                
                <div style={{ position: "relative", width: "100%", height: "180px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.03)" }}></div>
                  <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.03)" }}></div>
                  <div style={{ position: "absolute", top: "75%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.03)" }}></div>
                  
                  <svg viewBox="0 0 500 150" width="100%" height="150" style={{ overflow: "visible" }}>
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-purple)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--color-purple)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 120 Q 80 40 160 80 T 320 20 T 480 60 L 480 150 L 0 150 Z" fill="url(#chartGrad)" />
                    <path d="M 0 120 Q 80 40 160 80 T 320 20 T 480 60" fill="none" stroke="var(--color-purple)" strokeWidth="3" strokeLinecap="round" />
                    
                    <circle cx="80" cy="50" r="5" fill="var(--color-purple)" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="160" cy="80" r="5" fill="var(--color-purple)" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="320" cy="20" r="5" fill="var(--color-purple)" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="480" cy="60" r="5" fill="var(--color-purple)" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
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
                    <CourseCard key={course.id} course={course} onSelect={() => setSelectedCourse(course)} />
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
                    { title: "Newtonian Physics Webinar", meta: "Time: Tomorrow, 9:00 AM (Classroom)", type: "purple", url: "/classroom" },
                    { title: "Chemistry Assessment Paper", meta: "Due: July 16, 11:59 PM (Quiz)", type: "orange", url: "/quiz" },
                    { title: "Trigonometry Masterclass", meta: "Time: July 16, 2:00 PM (Classroom)", type: "purple", url: "/classroom" }
                  ].map((task, i) => (
                    <div className={styles.scheduleItem} key={i} onClick={() => window.location.href = task.url} style={{ cursor: "pointer" }}>
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

              {/* Quiz Performance Analytics */}
              <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", border: "1px solid var(--glass-border)" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                  <TrendingUp size={20} color="var(--color-orange)" /> Quiz Score Distribution
                </h2>

                <div style={{ display: "flex", justifyContent: "space-around", alignItems: "flex-end", height: "180px", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  {[
                    { quiz: "Chemistry 101", avg: "82%", val: 82 },
                    { quiz: "Trigonometry 202", avg: "74%", val: 74 },
                    { quiz: "Mechanics 301", avg: "68%", val: 68 },
                    { quiz: "Literature 404", avg: "91%", val: 91 },
                  ].map((bar, i) => (
                    <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "70px", gap: "10px" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--color-orange)" }}>{bar.avg}</span>
                      <div style={{ width: "24px", height: `${bar.val * 1.3}px`, background: "var(--gradient-primary)", borderRadius: "6px 6px 0 0", boxShadow: "0 0 10px rgba(249,115,22,0.15)" }}></div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%" }} title={bar.quiz}>{bar.quiz}</span>
                    </div>
                  ))}
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
                      {submissions.map((sub, idx) => (
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
                  <button onClick={() => window.location.href = "/quiz?action=create"} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "var(--primary)", border: "none", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                    <PlusCircle size={16} /> Create New Quiz
                  </button>
                  <button onClick={() => window.location.href = "/classroom?action=upload"} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
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
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60a5fa" }}>
                    <Users size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{studentsCount}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Students</p>
                  </div>
                </div>
                
                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(249, 115, 22, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-orange)" }}>
                    <GraduationCap size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{teachersCount}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Teachers</p>
                  </div>
                </div>

                <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-purple)" }}>
                    <Database size={24} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{allUsersList.length}</h3>
                    <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Accounts</p>
                  </div>
                </div>
              </div>

              {/* Activity Analytics Graph */}
              <div className="glass-panel" style={{ padding: "2rem", borderRadius: "24px", border: "1px solid var(--glass-border)", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
                  <TrendingUp size={20} color="var(--color-purple)" /> Platform Engagement Trends
                </h2>

                <div style={{ position: "relative", width: "100%", height: "180px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                  <div style={{ position: "absolute", top: "25%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.03)" }}></div>
                  <div style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.03)" }}></div>
                  <div style={{ position: "absolute", top: "75%", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.03)" }}></div>
                  
                  <svg viewBox="0 0 500 150" width="100%" height="150" style={{ overflow: "visible" }}>
                    <defs>
                      <linearGradient id="adminChartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--color-orange)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="var(--color-orange)" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>
                    <path d="M 0 130 Q 100 60 200 110 T 400 40 T 500 90 L 500 150 L 0 150 Z" fill="url(#adminChartGrad)" />
                    <path d="M 0 130 Q 100 60 200 110 T 400 40 T 500 90" fill="none" stroke="var(--color-orange)" strokeWidth="3" strokeLinecap="round" />
                    
                    <circle cx="100" cy="78" r="5" fill="var(--color-orange)" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="200" cy="110" r="5" fill="var(--color-orange)" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="300" cy="55" r="5" fill="var(--color-orange)" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="400" cy="40" r="5" fill="var(--color-orange)" stroke="#ffffff" strokeWidth="2" />
                  </svg>
                  
                  <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0 0 0", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
                    <span>Jul 09</span>
                    <span>Jul 10</span>
                    <span>Jul 11</span>
                    <span>Jul 12</span>
                    <span>Jul 13</span>
                    <span>Jul 14</span>
                    <span>Jul 15</span>
                  </div>
                </div>
              </div>

              {/* Activity Log Stream */}
              <div className="glass-panel" style={{ padding: "2rem", borderRadius: "24px", border: "1px solid var(--glass-border)", marginBottom: "2rem" }}>
                <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5rem" }}>Recent Platform Activity Stream</h2>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  {[
                    { log: "Student Kavishka Aswaththa completed 'Grade 10 Science Quiz' (90% Score)", time: "10 minutes ago", icon: "✓", color: "#22c55e" },
                    { log: "Professor Davis scheduled a new Pure Mathematics Live Session", time: "1 hour ago", icon: "🗓", color: "var(--color-orange)" },
                    { log: "Professor Davis updated English Literature curriculum worksheets", time: "3 hours ago", icon: "✏️", color: "var(--color-purple)" },
                    { log: "Student Nishadi Perera logged into the classroom workspace", time: "5 hours ago", icon: "👤", color: "#60a5fa" },
                    { log: "School database backup saved successfully to local secure storage", time: "1 day ago", icon: "⚙️", color: "#e2e8f0" }
                  ].map((act, i) => (
                    <div key={i} style={{ display: "flex", gap: "1rem", alignItems: "flex-start", borderBottom: i < 4 ? "1px solid rgba(255,255,255,0.04)" : "none", paddingBottom: "0.8rem" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
                        {act.icon}
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ fontSize: "0.88rem", color: "#ffffff", fontWeight: "500" }}>{act.log}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{act.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className={styles.rightColumn}>
              {/* Account Composition */}
              <div className={styles.sideCard} style={{ marginBottom: "2rem" }}>
                <h3 className={styles.sideCardTitle}>Account Composition</h3>
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginTop: "1rem" }}>
                  <svg width="80" height="80" viewBox="0 0 36 36" style={{ transform: "rotate(-90deg)" }}>
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-purple)" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--color-orange)" strokeWidth="4" strokeDasharray="25 75" strokeDashoffset="-10" />
                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#22c55e" strokeWidth="4" strokeDasharray="65 35" strokeDashoffset="-35" />
                  </svg>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", fontSize: "0.8rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-purple)" }}></div>
                      <span style={{ color: "var(--text-secondary)" }}>Admins: 10%</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--color-orange)" }}></div>
                      <span style={{ color: "var(--text-secondary)" }}>Teachers: 25%</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#22c55e" }}></div>
                      <span style={{ color: "var(--text-secondary)" }}>Students: 65%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Database Center */}
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%)" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#ffffff" }}>Administrator Panel</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Quick buttons to manage student records and export reports.</p>
                
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <button onClick={handleBackup} disabled={backupStatus !== "idle"} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: backupStatus === "done" ? "#22c55e" : "var(--primary)", border: "none", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", opacity: backupStatus === "backing_up" ? 0.7 : 1 }}>
                    <Database size={16} /> {backupStatus === "idle" ? "Backup Student Records" : backupStatus === "backing_up" ? "Backing up profiles..." : "Backup Completed! ✓"}
                  </button>
                  <button onClick={handleExport} disabled={exportStatus !== "idle"} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: exportStatus === "done" ? "#22c55e" : "rgba(255,255,255,0.05)", border: exportStatus === "done" ? "none" : "1px solid rgba(255,255,255,0.08)", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer", opacity: exportStatus === "exporting" ? 0.7 : 1 }}>
                    <ClipboardList size={16} /> {exportStatus === "idle" ? "Export Student Reports" : exportStatus === "exporting" ? "Generating CSV..." : "Report Downloaded! ✓"}
                  </button>
                </div>
              </div>

              {/* Activity Feed */}
              <div className={styles.sideCard}>
                <div className={styles.sideCardHeader}>
                  <h3 className={styles.sideCardTitle}>Recent Activity</h3>
                </div>
                <div className={styles.scheduleList}>
                  <div className={styles.scheduleItem}>
                    <div className={`${styles.scheduleIndicator} ${styles.indicatorPurple}`}></div>
                    <div className={styles.scheduleDetails}>
                      <span className={styles.scheduleTitle}>School Database Connected</span>
                      <span className={styles.scheduleMeta}>Status: Online</span>
                    </div>
                  </div>
                  <div className={styles.scheduleItem}>
                    <div className={`${styles.scheduleIndicator} ${styles.indicatorOrange}`}></div>
                    <div className={styles.scheduleDetails}>
                      <span className={styles.scheduleTitle}>Professor Davis logged in</span>
                      <span className={styles.scheduleMeta}>Role: Teacher</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Course Syllabus Modal Overlay */}
      {selectedCourse && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200, padding: "1.5rem" }}>
          <div className="glass-panel" style={{ width: "100%", maxWidth: "700px", border: "1px solid var(--glass-border)", padding: "2rem", borderRadius: "20px", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "2rem", position: "relative" }}>
            
            {/* Close Button */}
            <button onClick={() => setSelectedCourse(null)} style={{ position: "absolute", top: "15px", right: "15px", background: "none", border: "none", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <X size={20} />
            </button>

            {/* Left Info Column */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", textAlign: "left" }}>
              <div>
                <span style={{ fontSize: "0.75rem", background: "rgba(139,92,246,0.15)", color: "#a78bfa", padding: "4px 8px", borderRadius: "6px", fontWeight: "bold", textTransform: "uppercase" }}>
                  {selectedCourse.grade}
                </span>
                <h3 style={{ fontSize: "1.3rem", fontWeight: "bold", color: "#ffffff", marginTop: "10px", marginBottom: "12px", lineHeight: "1.3" }}>{selectedCourse.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.5" }}>{selectedCourse.description}</p>
              </div>

              <div style={{ marginTop: "20px" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "6px" }}>Progress Checklist</span>
                <div style={{ width: "100%", height: "8px", background: "rgba(255,255,255,0.04)", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{ width: `${selectedCourse.progress}%`, height: "100%", background: "var(--gradient-primary)" }}></div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <span>{selectedCourse.progress}% completed</span>
                  <span>{selectedCourse.lessonsCount} lessons total</span>
                </div>
              </div>
            </div>

            {/* Right Syllabus/Tasks Column */}
            <div style={{ borderLeft: "1px solid rgba(255,255,255,0.06)", paddingLeft: "1.5rem", textAlign: "left" }}>
              <h4 style={{ color: "#ffffff", fontSize: "0.95rem", fontWeight: "bold", marginBottom: "12px" }}>Course Learning Pathway</h4>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  { title: "Core Concepts & Webinar", desc: "Live instruction webinar and forum chat room.", actionLabel: "Join Live", path: "/classroom?action=schedule" },
                  { title: "Syllabus Video Recaps", desc: "Access archives of lessons & dynamic formulas.", actionLabel: "Play Recaps", path: "/classroom" },
                  { title: "Diagnostic Exercises Quiz", desc: "Formative worksheets to check comprehension.", actionLabel: "Start Paper", path: "/quiz" }
                ].map((item, idx) => (
                  <div key={idx} style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", borderRadius: "10px", padding: "10px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ flex: 1, paddingRight: "10px" }}>
                      <strong style={{ color: "#ffffff", fontSize: "0.85rem", display: "block" }}>{item.title}</strong>
                      <span style={{ color: "var(--text-secondary)", fontSize: "0.75rem", display: "block", marginTop: "2px", lineHeight: "1.3" }}>{item.desc}</span>
                    </div>
                    <button 
                      onClick={() => window.location.href = item.path}
                      className="gradient-button" 
                      style={{ padding: "6px 12px", fontSize: "0.75rem", borderRadius: "6px", whiteSpace: "nowrap" }}
                    >
                      {item.actionLabel}
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
