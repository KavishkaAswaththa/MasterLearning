"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import CourseCard, { CourseData } from "@/components/CourseCard";
import { BookOpen, GraduationCap, CheckCircle, X } from "lucide-react";

import { getCoursesList } from "@/lib/db";

export default function CoursesPage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Selected course details state
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.replace("/login?error=auth_required");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));

    getCoursesList().then((list) => {
      setCourses(list);
    });

    const params = new URLSearchParams(window.location.search);
    const searchVal = params.get("search");
    if (searchVal) {
      setSearchQuery(searchVal);
    }
  }, []);

  const filteredCourses = courses.filter((course) => {
    if (filter === "science") {
      if (course.iconType !== "physics" && course.iconType !== "chemistry") return false;
    } else if (filter === "math" && course.iconType !== "math") {
      return false;
    } else if (filter === "it" && course.iconType !== "it") {
      return false;
    }

    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      const matchTitle = course.title.toLowerCase().includes(query);
      const matchDesc = course.description.toLowerCase().includes(query);
      return matchTitle || matchDesc;
    }
    return true;
  });

  // Calculate live statistics
  const totalCourses = courses.length;
  const averageProgress = courses.length > 0
    ? (courses.reduce((acc, c) => acc + c.progress, 0) / courses.length).toFixed(0) + "%"
    : "0%";
  const lessonsCompleted = courses.reduce((acc, c) => acc + Math.round((c.progress / 100) * c.lessonsCount), 0);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Courses...</div>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <div className="glow-purple" style={{ top: "10%", left: "20%" }}></div>
      <div className="glow-orange" style={{ bottom: "10%", right: "10%" }}></div>

      <Sidebar activeTab="courses" />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.greetingSection}>
            <h1>Curriculum Courses</h1>
            <p>Explore your registered subjects and learning tracks.</p>
          </div>

          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search subjects..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dynamic Course Statistics Row */}
        <div className={styles.metricsRow} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-purple)" }}>
              <BookOpen size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{totalCourses}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Active Courses</p>
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(249, 115, 22, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-orange)" }}>
              <GraduationCap size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{averageProgress}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Average Progress</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34, 197, 94, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e" }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{lessonsCompleted}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Lessons Finished</p>
            </div>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", border: "1px solid var(--glass-border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ padding: "8px", borderRadius: "8px", background: "rgba(139,92,246,0.15)", color: "var(--color-purple)" }}>
                <BookOpen size={20} />
              </div>
              <h2 style={{ fontSize: "1.1rem", fontWeight: "bold", margin: 0 }}>Filter Subjects</h2>
            </div>
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

          <div className={styles.coursesGrid} style={{ marginTop: "1.5rem" }}>
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} onSelect={() => setSelectedCourse(course)} />
            ))}
          </div>
        </div>
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
