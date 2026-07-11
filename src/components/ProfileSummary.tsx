"use client";

import React, { useState, useEffect } from "react";
import styles from "./ProfileSummary.module.css";

interface BadgeReward {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  themeClass: string;
}

export default function ProfileSummary() {
  const [xp, setXp] = useState(0);
  const targetXp = 2450;
  const level = 12;
  const nextLevelXp = 3000;
  
  // Animate progress bar fill on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setXp(targetXp);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const badges: BadgeReward[] = [
    {
      id: "streak",
      name: "7-Day Streak",
      description: "Studied for 7 days in a row! Keep the fire burning.",
      themeClass: styles.badgeOrange,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
        </svg>
      )
    },
    {
      id: "quiz",
      name: "Quiz Master",
      description: "Scored 100% on a science assessment.",
      themeClass: styles.badgeGold,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="8" r="7" />
          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
        </svg>
      )
    },
    {
      id: "video",
      name: "Super Viewer",
      description: "Watched over 10 hours of video classrooms.",
      themeClass: styles.badgePurple,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="23 7 16 12 23 17 23 7" />
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
        </svg>
      )
    },
    {
      id: "perfect",
      name: "Elite Scholar",
      description: "Completed all Grade 10 module prerequisites.",
      themeClass: styles.badgeCyan,
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      )
    }
  ];

  const xpPercent = Math.min((xp / nextLevelXp) * 100, 100);

  return (
    <div className={styles.profileCard}>
      <div className={styles.header}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarInner}>NP</div>
          <div className={styles.glowRing}></div>
        </div>
        <div className={styles.details}>
          <h2 className={styles.name}>Nishadi Perera</h2>
          <div className={styles.meta}>
            <span>Grade 11 Student</span>
            <span className={styles.badge}>PRO</span>
          </div>
        </div>
      </div>

      <div className={styles.xpContainer}>
        <div className={styles.xpHeader}>
          <span className={styles.levelText}>Level {level}</span>
          <span className={styles.xpText}>{xp} / {nextLevelXp} XP to Lvl {level + 1}</span>
        </div>
        <div className={styles.progressBarTrack}>
          <div 
            className={styles.progressBarFill} 
            style={{ width: `${xpPercent}%` }}
          ></div>
        </div>
      </div>

      <div className={styles.rewardsSection}>
        <h3 className={styles.rewardsTitle}>Recent Accomplishments</h3>
        <div className={styles.badgeGrid}>
          {badges.map((badge) => (
            <div key={badge.id} className={styles.rewardBadge}>
              <div className={`${styles.badgeIcon} ${badge.themeClass}`}>
                {badge.icon}
              </div>
              <span className={styles.badgeName}>{badge.name}</span>
              <div className={styles.tooltip}>
                <strong>{badge.name}</strong>
                <p style={{ marginTop: "4px" }}>{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
