"use client";

import React from "react";
import styles from "./CourseCard.module.css";

export interface CourseData {
  id: string;
  title: string;
  description: string;
  grade: string;
  lessonsCount: number;
  quizzesCount: number;
  duration: string;
  progress: number;
  iconType: "math" | "science" | "it" | "english" | "physics" | "chemistry";
}

interface CourseCardProps {
  course: CourseData;
  onSelect?: (id: string) => void;
}

export default function CourseCard({ course, onSelect }: CourseCardProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "math":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="2" x2="22" y2="6" />
            <line x1="2" y1="18" x2="6" y2="22" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
          </svg>
        );
      case "science":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="1" />
            <path d="M20.2 20.2A10 10 0 0 0 12 2a10 10 0 0 0-8.2 18.2M12 2v20M2 12h20" />
            <path d="M12 12a15.3 15.3 0 0 1 4-10M12 12a15.3 15.3 0 0 0-4-10" />
            <path d="M12 12a15.3 15.3 0 0 1 4 10M12 12a15.3 15.3 0 0 0-4 10" />
          </svg>
        );
      case "it":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
            <line x1="14" y1="4" x2="10" y2="20" />
          </svg>
        );
      case "physics":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
          </svg>
        );
      case "chemistry":
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3h12" />
            <path d="M12 3v10" />
            <path d="M10 10H5l-3 7c-.5 1 .2 2 1.3 2h17.4c1.1 0 1.8-1 1.3-2l-3-7h-5" />
          </svg>
        );
      case "english":
      default:
        return (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
          </svg>
        );
    }
  };

  return (
    <div className={styles.card} onClick={() => onSelect && onSelect(course.id)}>
      <div className={styles.cardGlow}></div>
      
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          {getIcon(course.iconType)}
        </div>
        <span className={styles.gradeTag}>{course.grade}</span>
      </div>

      <div className={styles.titleSection}>
        <h3 className={styles.subjectName}>{course.title}</h3>
        <p className={styles.description}>{course.description}</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{course.lessonsCount}</span>
          <span className={styles.statLabel}>Lessons</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{course.quizzesCount}</span>
          <span className={styles.statLabel}>Quizzes</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statVal}>{course.duration}</span>
          <span className={styles.statLabel}>Hours</span>
        </div>
      </div>

      <div className={styles.footer}>
        <div className={styles.progressContainer}>
          <div className={styles.progressHeader}>
            <span style={{ color: "var(--text-secondary)" }}>Progress</span>
            <span className={styles.progressPercent}>{course.progress}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div className={styles.progressFill} style={{ width: `${course.progress}%` }}></div>
          </div>
        </div>

        <button className={styles.actionButton}>
          <span>{course.progress > 0 ? "Resume Learning" : "Start Learning"}</span>
          <svg className={styles.btnIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
