"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getRecentSubmissions, QuizSubmission } from "@/lib/db";
import { ClipboardList, Play, HelpCircle } from "lucide-react";

export default function QuizListPage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.href = "/login?error=auth_required";
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));

    getRecentSubmissions().then((list) => {
      setSubmissions(list);
    });
  }, []);

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Quizzes...</div>
      </div>
    );
  }

  const availableQuizzes = [
    { id: "science-101", title: "Grade 10 General Chemistry", desc: "Covers organic structures, chemical balances, and table elements.", questions: 10, duration: "10 mins", grade: "Grade 10" },
    { id: "math-202", title: "Grade 11 Trigonometry Basics", desc: "Triangles, trigonometric ratios, sine/cosine laws, and graphing functions.", questions: 8, duration: "12 mins", grade: "Grade 11" }
  ];

  // For students, only show their own submissions. For teachers/admins, show all submissions.
  const filteredSubmissions = user.role === "student"
    ? submissions.filter(sub => sub.email.toLowerCase() === user.email.toLowerCase())
    : submissions;

  return (
    <div className={styles.layout}>
      <div className="glow-purple" style={{ top: "10%", left: "20%" }}></div>
      <div className="glow-orange" style={{ bottom: "10%", right: "10%" }}></div>

      <Sidebar activeTab="quiz" />

      <main className={styles.mainContent}>
        <div className={styles.header}>
          <div className={styles.greetingSection}>
            <h1>Assessment Center</h1>
            <p>Test your knowledge with worksheets and review past score results.</p>
          </div>
        </div>

        <div className={styles.dashboardGrid}>
          {/* Left Column */}
          <div className={styles.leftColumn}>
            {/* Available Quizzes */}
            <div className="glass-panel" style={{ padding: "2rem", marginBottom: "2rem", border: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                <HelpCircle size={20} color="var(--color-orange)" /> Active Quizzes
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {availableQuizzes.map((quiz) => (
                  <div key={quiz.id} className="glass-panel-hover" style={{ padding: "1.5rem", borderRadius: "14px", border: "1px solid rgba(255,255,255,0.04)", background: "rgba(255,255,255,0.01)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem" }}>
                    <div style={{ flex: "1 1 300px" }}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "6px" }}>
                        <span style={{ fontSize: "0.75rem", background: "rgba(249, 115, 22, 0.15)", color: "var(--color-orange)", padding: "3px 8px", borderRadius: "4px", fontWeight: "bold" }}>{quiz.grade}</span>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{quiz.questions} Questions | {quiz.duration}</span>
                      </div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: "bold", color: "#ffffff", marginBottom: "4px" }}>{quiz.title}</h3>
                      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", lineHeight: "1.4" }}>{quiz.desc}</p>
                    </div>
                    <div>
                      <Link href={`/quiz/${quiz.id}`} className="gradient-button" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", fontSize: "0.9rem", borderRadius: "8px", padding: "10px 20px" }}>
                        <Play size={14} fill="currentColor" /> Start Quiz
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Log */}
            <div className="glass-panel" style={{ padding: "2rem", border: "1px solid var(--glass-border)" }}>
              <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", marginBottom: "1.5rem", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                <ClipboardList size={20} color="var(--color-purple)" /> Quiz History Logs
              </h2>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "500px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      <th style={{ padding: "10px" }}>Student Name</th>
                      <th style={{ padding: "10px" }}>Quiz / Subject</th>
                      <th style={{ padding: "10px" }}>Score</th>
                      <th style={{ padding: "10px" }}>Date Completed</th>
                      <th style={{ padding: "10px" }}>Status</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "0.9rem" }}>
                    {filteredSubmissions.length > 0 ? (
                      filteredSubmissions.map((sub, i) => (
                        <tr key={`${sub.email}-${sub.quizId}-${sub.date}-${i}`} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "12px 10px", fontWeight: "600" }}>{sub.name}</td>
                          <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{sub.subject}</td>
                          <td style={{ padding: "12px 10px", color: "var(--color-orange)", fontWeight: "bold" }}>{sub.score}</td>
                          <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "0.8rem" }}>{sub.date}</td>
                          <td style={{ padding: "12px 10px" }}>
                            <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: "bold", background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                              {sub.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} style={{ padding: "30px", textAlign: "center", color: "var(--text-muted)" }}>
                          No quiz history submissions found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
