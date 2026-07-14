"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import CourseCard, { CourseData } from "@/components/CourseCard";
import { BookOpen } from "lucide-react";

export default function CoursesPage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login?error=auth_required";
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));
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

  const filteredCourses = mockCourses.filter((course) => {
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
        </div>

        {filteredCourses.length > 0 ? (
          <div className={styles.coursesGrid}>
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ padding: "60px 40px", textAlign: "center", color: "var(--text-secondary)" }}>
            <p>No subject courses match your filter or search query.</p>
          </div>
        )}
      </main>
    </div>
  );
}
