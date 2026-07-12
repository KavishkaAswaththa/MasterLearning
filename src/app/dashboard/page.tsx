"use client";

import React, { useState } from "react";
import styles from "./page.module.css";
import Sidebar from "@/components/Sidebar";
import ProfileSummary from "@/components/ProfileSummary";
import CourseCard, { CourseData } from "@/components/CourseCard";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [filter, setFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

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
            <h1>Welcome back, Nishadi!</h1>
            <p>Let&apos;s pick up where you left off on your learning journey today.</p>
          </div>

          <div className={styles.searchBar}>
            <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              placeholder="Search subjects or chapters..."
              className={styles.searchInput}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className={styles.dashboardGrid}>
          {/* Main learning section */}
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

              {/* Decorative graduation cap SVG illustration */}
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
                <button
                  className={`${styles.filterTab} ${filter === "all" ? styles.activeFilterTab : ""}`}
                  onClick={() => setFilter("all")}
                >
                  All
                </button>
                <button
                  className={`${styles.filterTab} ${filter === "science" ? styles.activeFilterTab : ""}`}
                  onClick={() => setFilter("science")}
                >
                  Science
                </button>
                <button
                  className={`${styles.filterTab} ${filter === "math" ? styles.activeFilterTab : ""}`}
                  onClick={() => setFilter("math")}
                >
                  Mathematics
                </button>
                <button
                  className={`${styles.filterTab} ${filter === "it" ? styles.activeFilterTab : ""}`}
                  onClick={() => setFilter("it")}
                >
                  IT
                </button>
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

          {/* Sidebar helper panels (Profile, Badges, Schedule) */}
          <div className={styles.rightColumn}>
            {/* Student gamified profile card */}
            <ProfileSummary />

            {/* Interactive Schedule card */}
            <div className={styles.sideCard}>
              <div className={styles.sideCardHeader}>
                <h3 className={styles.sideCardTitle}>Upcoming Classroom Tasks</h3>
                <span className={styles.viewAllLink}>View Calendar</span>
              </div>

              <div className={styles.scheduleList}>
                <div className={styles.scheduleItem}>
                  <div className={`${styles.scheduleIndicator} ${styles.indicatorOrange}`}></div>
                  <div className={styles.scheduleDetails}>
                    <span className={styles.scheduleTitle}>Physics: Chapter 4 Quiz</span>
                    <span className={styles.scheduleMeta}>Due: Today, 11:59 PM (Assessment)</span>
                  </div>
                  <div className={styles.playButtonIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                <div className={styles.scheduleItem}>
                  <div className={`${styles.scheduleIndicator} ${styles.indicatorPurple}`}></div>
                  <div className={styles.scheduleDetails}>
                    <span className={styles.scheduleTitle}>Organic Chemistry Live Class</span>
                    <span className={styles.scheduleMeta}>Starts: Tomorrow, 10:00 AM (Classroom)</span>
                  </div>
                  <div className={styles.playButtonIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                    </svg>
                  </div>
                </div>

                <div className={styles.scheduleItem}>
                  <div className={`${styles.scheduleIndicator} ${styles.indicatorOrange}`}></div>
                  <div className={styles.scheduleDetails}>
                    <span className={styles.scheduleTitle}>Maths: Trigonometry Worksheet</span>
                    <span className={styles.scheduleMeta}>Due: July 15, 4:00 PM (Exercise)</span>
                  </div>
                  <div className={styles.playButtonIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
