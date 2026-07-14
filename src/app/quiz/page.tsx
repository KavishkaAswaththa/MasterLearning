"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getRecentSubmissions, QuizSubmission } from "@/lib/db";
import { ClipboardList, Play, HelpCircle, PlusCircle } from "lucide-react";

interface QuizData {
  id: string;
  title: string;
  desc: string;
  questions: number;
  duration: string;
  grade: string;
}

export default function QuizListPage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);

  // State for dynamic quizzes list
  const [availableQuizzes, setAvailableQuizzes] = useState<QuizData[]>([
    { id: "science-101", title: "Grade 10 General Chemistry", desc: "Covers organic structures, chemical balances, and table elements.", questions: 10, duration: "10 mins", grade: "Grade 10" },
    { id: "math-202", title: "Grade 11 Trigonometry Basics", desc: "Triangles, trigonometric ratios, sine/cosine laws, and graphing functions.", questions: 8, duration: "12 mins", grade: "Grade 11" }
  ]);

  // Quiz creation modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizGrade, setQuizGrade] = useState("Grade 10");
  const [quizQuestions, setQuizQuestions] = useState(10);
  const [quizDuration, setQuizDuration] = useState("15 mins");
  const [quizDesc, setQuizDesc] = useState("");

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

    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "create") {
      setShowCreateModal(true);
    }
  }, []);

  const handleCreateQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;

    const newQuiz: QuizData = {
      id: quizTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      title: quizTitle,
      grade: quizGrade,
      questions: Number(quizQuestions),
      duration: quizDuration,
      desc: quizDesc || "No description provided."
    };

    setAvailableQuizzes([newQuiz, ...availableQuizzes]);
    setShowCreateModal(false);
    setQuizTitle("");
    setQuizDesc("");
    alert("New quiz created successfully!");
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Quizzes...</div>
      </div>
    );
  }

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

          {/* Right Column */}
          <div className={styles.rightColumn}>
            {user.role === "teacher" || user.role === "admin" ? (
              <div className={styles.sideCard} style={{ background: "linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(249, 115, 22, 0.08) 100%)" }}>
                <h3 className={styles.sideCardTitle} style={{ color: "#ffffff" }}>Assessment Manager</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "1.5rem" }}>Publish worksheets, mock papers, and check grades.</p>
                <button onClick={() => setShowCreateModal(true)} style={{ display: "flex", alignItems: "center", gap: "10px", width: "100%", background: "var(--primary)", border: "none", color: "#ffffff", padding: "0.8rem", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>
                  <PlusCircle size={16} /> Create New Quiz
                </button>
              </div>
            ) : null}

            <div className={styles.sideCard}>
              <h3 className={styles.sideCardTitle}>Assessment Guidelines</h3>
              <ul style={{ fontSize: "0.85rem", color: "var(--text-secondary)", paddingLeft: "15px", margin: "10px 0", display: "flex", flexDirection: "column", gap: "8px" }}>
                <li>Quizzes must be completed within the allocated timer limits.</li>
                <li>Each student has one dynamic attempt per quiz.</li>
                <li>Scores will be logged in the public records vault immediately.</li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      {/* Create Quiz Modal */}
      {showCreateModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1200 }}>
          <div className="glass-panel" style={{ padding: "2.5rem", width: "100%", maxWidth: "400px", border: "1px solid var(--glass-border)" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5rem" }}>Create New Quiz</h2>
            <form onSubmit={handleCreateQuiz} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Quiz Title</label>
                <input type="text" required placeholder="e.g. Grade 10 Biology Basics" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Grade Level</label>
                <select value={quizGrade} onChange={(e) => setQuizGrade(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(25,18,50,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }}>
                  <option value="Grade 10">Grade 10</option>
                  <option value="Grade 11">Grade 11</option>
                  <option value="Grade 12">Grade 12</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Questions</label>
                  <input type="number" required value={quizQuestions} onChange={(e) => setQuizQuestions(Number(e.target.value))} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Duration</label>
                  <input type="text" required value={quizDuration} onChange={(e) => setQuizDuration(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Description</label>
                <textarea rows={3} placeholder="Describe quiz subjects..." value={quizDesc} onChange={(e) => setQuizDesc(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none", resize: "none" }} />
              </div>
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem" }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className="gradient-button" style={{ padding: "8px 16px", borderRadius: "6px" }}>Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
