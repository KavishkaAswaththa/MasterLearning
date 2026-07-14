"use client";

import React from "react";
import Link from "next/link";
import styles from "./Sidebar.module.css";

interface SidebarProps {
  activeTab?: string;
}

export default function Sidebar({ activeTab = "dashboard" }: SidebarProps) {
  const [user] = React.useState<{ name: string; role: string; email?: string } | null>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : { name: "Nishadi Perera", role: "student" };
    }
    return null;
  });

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      )
    },
    ...(user && user.role === "admin" ? [
      {
        id: "users",
        label: "Users",
        icon: (
          <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        )
      }
    ] : []),
    {
      id: "courses",
      label: "Courses",
      icon: (
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      )
    },
    {
      id: "classroom",
      label: "Classroom",
      icon: (
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
          <polygon points="10 8 16 10 10 12 10 8" fill="currentColor" />
        </svg>
      )
    },
    {
      id: "quiz",
      label: "Quizzes",
      icon: (
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="15" x2="15" y2="15" />
          <line x1="9" y1="11" x2="15" y2="11" />
          <path d="M9 19h10" />
        </svg>
      )
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    },
    {
      id: "settings",
      label: "Settings",
      icon: (
        <svg className={styles.navIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      )
    }
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logoContainer}>
        <div className={styles.logoIcon}>ML</div>
        <span className={styles.logoText}>
          Master<span className={styles.logoHighlight}>Learning</span>
        </span>
      </div>

      <nav className={styles.navSection}>
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          const href = item.id === "dashboard" ? "/dashboard" : `/${item.id}`;
          return (
            <Link
              key={item.id}
              href={href}
              className={`${styles.navItem} ${isActive ? styles.activeNavItem : ""}`}
            >
              {item.icon}
              <span className={styles.labelText}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footerSection}>
        <div className={styles.userCard}>
          <div className={styles.avatar}>
            <div className={styles.avatarInner}>
              {user ? user.name.charAt(0).toUpperCase() : "N"}
            </div>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user ? user.name : "Nishadi Perera"}</span>
            <span className={styles.userRole}>
              {user ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Student"}
            </span>
          </div>
        </div>

        <button className={styles.logoutButton} onClick={handleLogout}>
          <svg className={styles.logoutIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
          <span className={styles.logoutText}>Logout</span>
        </button>
      </div>
    </aside>
  );
}
