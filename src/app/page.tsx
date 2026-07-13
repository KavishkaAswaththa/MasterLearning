import React from "react";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <span className={styles.badge}>Group Project Development Hub</span>
        <h1 className={styles.title}>MasterLearning Platform</h1>
        <p className={styles.subtitle}>
          A scalable, cloud-native E-Learning platform designed for concurrent student access,
          rich-media delivery, and robust assessments.
        </p>
      </header>

      {/* Grid of group member tasks */}
      <main className={styles.hubGrid}>
        {/* Dilhara - Quiz Portal */}
        <section className={`${styles.card} ${styles.activeCard}`}>
          <div className={styles.cardIcon}>📝</div>
          <h2 className={styles.cardTitle}>Quiz Portal</h2>
          <p className={styles.cardDesc}>
            Dilhara&apos;s component. Features countdown timers, multi-choice responsive inputs, state
            capture, validation checks, and visual grade dashboards.
          </p>
          <div className={styles.linkList}>
            <Link href="/quiz/science-101" className={styles.linkItem}>
              <span>Grade 10 Science Quiz</span>
            </Link>
            <Link href="/quiz/math-202" className={styles.linkItem}>
              <span>Grade 11 Mathematics Quiz</span>
            </Link>
          </div>
        </section>

        {/* Nishadi - Student Dashboard */}
        <section className={styles.card}>
          <div className={styles.cardIcon}>🎛️</div>
          <h2 className={styles.cardTitle}>Student Dashboard</h2>
          <p className={styles.cardDesc}>
            Nishadi&apos;s component. Displays sidebar navigation, profile rewards summary, XP
            tracker, and available Grade 6-13 course grids.
          </p>
          <div className={styles.linkList}>
            <Link href="/dashboard" className={styles.linkItem}>
              <span>Student Dashboard</span>
            </Link>
          </div>
        </section>

        {/* Gamidu - Video Classroom */}
        <section className={styles.card}>
          <div className={styles.cardIcon}>📺</div>
          <h2 className={styles.cardTitle}>Video Classroom</h2>
          <p className={styles.cardDesc}>
            Gamidu&apos;s component. Large responsive video streaming viewport, click-through lesson index,
            and downloadable lesson material panels.
          </p>
          <div className={styles.linkList}>
            <div className={`${styles.linkItem} ${styles.inactiveLink}`}>
              <span>Classroom <span className={styles.tag}>Gamidu&apos;s Branch</span></span>
            </div>
          </div>
        </section>

        {/* Tharushi - Auth pages */}
        <section className={styles.card}>
          <div className={styles.cardIcon}>🔑</div>
          <h2 className={styles.cardTitle}>Authentication Pages</h2>
          <p className={styles.cardDesc}>
            Tharushi&apos;s component. Sign-up and login cards implementing input validations, field check states, and error alerts.
          </p>
          <div className={styles.linkList}>
            <Link href="/login" className={styles.linkItem}>
              <span>Login Portal</span>
            </Link>
            <Link href="/signup" className={styles.linkItem}>
              <span>Sign Up Portal</span>
            </Link>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>MasterLearning E-Learning Platform | Mini-Hackathon 24-Hour Plan</p>
      </footer>
    </div>
  );
}
