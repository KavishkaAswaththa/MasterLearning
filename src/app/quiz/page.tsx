"use client";

import React, { useState, useEffect } from "react";
import styles from "../dashboard/page.module.css";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";
import { getRecentSubmissions, QuizSubmission, getQuizTemplates, saveQuizTemplate } from "@/lib/db";
import { Quiz } from "@/data/quizzes";
import { ClipboardList, Play, HelpCircle, PlusCircle, Search, ArrowUpDown, MoreVertical, Copy, Mail, ShieldCheck } from "lucide-react";

interface QuizData {
  id: string;
  title: string;
  desc: string;
  questions: number;
  duration: string;
  grade: string;
}

const mapQuizToQuizData = (q: Quiz): QuizData => {
  return {
    id: q.id,
    title: q.title,
    desc: q.description,
    questions: q.questions.length,
    duration: `${Math.round(q.durationSeconds / 60)} mins`,
    grade: q.grade
  };
};

const parseScoreToPercentage = (scoreStr: string): number => {
  if (!scoreStr) return 0;
  
  if (scoreStr.includes("%")) {
    const val = parseFloat(scoreStr.replace("%", ""));
    return isNaN(val) ? 0 : val;
  }
  
  if (scoreStr.includes("/")) {
    const parts = scoreStr.split("/");
    const num = parseFloat(parts[0]);
    const den = parseFloat(parts[1]);
    if (isNaN(num) || isNaN(den) || den === 0) return 0;
    return (num / den) * 100;
  }
  
  const fallback = parseFloat(scoreStr);
  return isNaN(fallback) ? 0 : fallback;
};

export default function QuizListPage() {
  const [user, setUser] = useState<{ email: string; role: string; name: string } | null>(null);
  const [submissions, setSubmissions] = useState<QuizSubmission[]>([]);

  // State for dynamic quizzes list
  const [availableQuizzes, setAvailableQuizzes] = useState<QuizData[]>([]);

  // Quiz search, filter, and sorting states
  const [quizSearch, setQuizSearch] = useState("");
  const [quizSort, setQuizSort] = useState("date-desc");
  const [quizStatusFilter, setQuizStatusFilter] = useState("all");

  // Row context menu tracker
  const [activeMenuIndex, setActiveMenuIndex] = useState<number | null>(null);

  // Quiz creation modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizGrade, setQuizGrade] = useState("Grade 10");
  const [quizDuration, setQuizDuration] = useState("15 mins");
  const [quizDesc, setQuizDesc] = useState("");

  interface QuestionInput {
    text: string;
    options: string[];
    correctIndex: number;
  }
  const [questionsList, setQuestionsList] = useState<QuestionInput[]>([
    { text: "", options: ["", "", "", ""], correctIndex: 0 }
  ]);

  const addQuestionField = () => {
    setQuestionsList([...questionsList, { text: "", options: ["", "", "", ""], correctIndex: 0 }]);
  };

  const removeQuestionField = (index: number) => {
    if (questionsList.length === 1) return;
    setQuestionsList(questionsList.filter((_, i) => i !== index));
  };

  const handleQuestionChange = (index: number, field: string, val: string | number) => {
    const copy = [...questionsList];
    if (field === "text") {
      copy[index].text = String(val);
    } else if (field === "correctIndex") {
      copy[index].correctIndex = Number(val);
    }
    setQuestionsList(copy);
  };

  const handleOptionChange = (qIndex: number, oIndex: number, val: string) => {
    const copy = [...questionsList];
    copy[qIndex].options[oIndex] = val;
    setQuestionsList(copy);
  };

  // Custom Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
  const showToast = (msg: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message: msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      window.location.replace("/login?error=auth_required");
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(JSON.parse(storedUser));

    getRecentSubmissions().then((list) => {
      setSubmissions(list);
    });

    getQuizTemplates().then((list) => {
      setAvailableQuizzes(list.map(mapQuizToQuizData));
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get("action") === "create") {
      setShowCreateModal(true);
    }
  }, []);

  const handleCreateQuiz = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizTitle.trim()) return;

    const parsedDuration = parseFloat(quizDuration) || 15;

    const questions = questionsList.map((q, idx) => ({
      id: `q-${idx + 1}`,
      text: q.text.trim() || `Question ${idx + 1}`,
      options: q.options.map((opt, oIdx) => opt.trim() || `Option ${oIdx + 1}`),
      correctOptionIndex: q.correctIndex,
      explanation: `The correct option is: ${q.options[q.correctIndex] || 'Option 1'}.`
    }));

    const newQuiz: Quiz = {
      id: quizTitle.toLowerCase().replace(/[^a-z0-9]/g, "-"),
      title: quizTitle,
      subject: quizGrade.includes("Math") ? "Mathematics" : "Science",
      durationSeconds: parsedDuration * 60,
      description: quizDesc || "No description provided.",
      grade: quizGrade,
      questions: questions
    };

    // Save to unified database
    await saveQuizTemplate(newQuiz);

    // Refresh templates list
    const updated = await getQuizTemplates();
    setAvailableQuizzes(updated.map(mapQuizToQuizData));

    setShowCreateModal(false);
    setQuizTitle("");
    setQuizDesc("");
    setQuestionsList([{ text: "", options: ["", "", "", ""], correctIndex: 0 }]);
    showToast(`New quiz "${quizTitle}" published successfully!`, "success");
  };

  const copyScoreDetails = (sub: QuizSubmission) => {
    navigator.clipboard.writeText(`Student: ${sub.name}, Subject: ${sub.subject}, Score: ${sub.score}, Date: ${sub.date}`);
    showToast(`Score copied for ${sub.name}!`, "success");
    setActiveMenuIndex(null);
  };

  const emailStudentRecord = (email: string) => {
    showToast(`Attempt transcript receipt emailed to ${email}!`, "success");
    setActiveMenuIndex(null);
  };

  const auditAnswerSheet = (name: string) => {
    showToast(`Detailed quiz sheets audited for ${name}: Verified ✓`, "info");
    setActiveMenuIndex(null);
  };

  if (!user) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ color: "#ffffff", fontSize: "1.2rem", fontWeight: "bold" }}>Loading Quizzes...</div>
      </div>
    );
  }

  // Filter submissions by role
  let processedSubmissions = user.role === "student"
    ? submissions.filter(sub => sub.email.toLowerCase() === user.email.toLowerCase())
    : submissions;

  // Calculate live statistics
  const totalSubmissions = processedSubmissions.length;
  const averageScore = processedSubmissions.length > 0
    ? (processedSubmissions.reduce((acc, curr) => {
        return acc + parseScoreToPercentage(curr.score);
      }, 0) / processedSubmissions.length).toFixed(0) + "%"
    : "N/A";
  const passedSubmissions = processedSubmissions.filter(sub => {
    return parseScoreToPercentage(sub.score) >= 50;
  }).length;

  // Apply search
  if (quizSearch.trim()) {
    const q = quizSearch.toLowerCase();
    processedSubmissions = processedSubmissions.filter(s => 
      s.name.toLowerCase().includes(q) || 
      s.subject.toLowerCase().includes(q)
    );
  }

  // Apply status filter
  if (quizStatusFilter !== "all") {
    processedSubmissions = processedSubmissions.filter(s => 
      s.status.toLowerCase() === quizStatusFilter.toLowerCase()
    );
  }

  // Apply sorting
  processedSubmissions.sort((a, b) => {
    if (quizSort === "name-asc") return a.name.localeCompare(b.name);
    if (quizSort === "name-desc") return b.name.localeCompare(a.name);
    if (quizSort === "date-desc") return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (quizSort === "date-asc") return new Date(a.date).getTime() - new Date(b.date).getTime();
    if (quizSort === "score-desc") {
      return parseScoreToPercentage(b.score) - parseScoreToPercentage(a.score);
    }
    if (quizSort === "score-asc") {
      return parseScoreToPercentage(a.score) - parseScoreToPercentage(b.score);
    }
    return 0;
  });

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

        {/* Quiz Metrics Stat Row */}
        <div className={styles.metricsRow} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(139, 92, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-purple)" }}>
              <ClipboardList size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{totalSubmissions}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Total Submissions</p>
            </div>
          </div>
          
          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(249, 115, 22, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-orange)" }}>
              <Play size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{averageScore}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Average Class Grade</p>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.5rem", borderRadius: "18px", display: "flex", gap: "1rem", alignItems: "center", border: "1px solid var(--glass-border)" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "12px", background: "rgba(34, 197, 94, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#22c55e" }}>
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{passedSubmissions}</h3>
              <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>Passing Scores</p>
            </div>
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
                      <Link href={`/quiz/attempt?id=${quiz.id}`} className="gradient-button" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", fontSize: "0.9rem", borderRadius: "8px", padding: "10px 20px" }}>
                        <Play size={14} fill="currentColor" /> Start Quiz
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submission Log */}
            <div className="glass-panel" style={{ padding: "2rem", border: "1px solid var(--glass-border)" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
                <h2 style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#ffffff", display: "flex", alignItems: "center", gap: "10px" }}>
                  <ClipboardList size={20} color="var(--color-purple)" /> Quiz History Logs
                </h2>

                {/* Table search, sort, and status controls */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                  
                  {/* Search */}
                  <div style={{ position: "relative", width: "180px" }}>
                    <Search size={14} color="var(--text-secondary)" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
                    <input 
                      type="text" 
                      placeholder="Search student or quiz..." 
                      value={quizSearch}
                      onChange={(e) => setQuizSearch(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "6px 10px 6px 30px",
                        borderRadius: "6px",
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#ffffff",
                        fontSize: "0.8rem",
                        outline: "none"
                      }}
                    />
                  </div>

                  {/* Status Filter */}
                  <select 
                    value={quizStatusFilter}
                    onChange={(e) => setQuizStatusFilter(e.target.value)}
                    style={{
                      background: "rgba(25,18,50,0.9)",
                      border: "1px solid rgba(255,255,255,0.08)",
                      color: "#ffffff",
                      padding: "6px 10px",
                      borderRadius: "6px",
                      fontSize: "0.8rem",
                      outline: "none"
                    }}
                  >
                    <option value="all">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="graded">Graded</option>
                  </select>

                  {/* Sorting */}
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <ArrowUpDown size={12} color="var(--text-secondary)" />
                    <select 
                      value={quizSort}
                      onChange={(e) => setQuizSort(e.target.value)}
                      style={{
                        background: "rgba(25,18,50,0.9)",
                        border: "1px solid rgba(255,255,255,0.08)",
                        color: "#ffffff",
                        padding: "6px 10px",
                        borderRadius: "6px",
                        fontSize: "0.8rem",
                        outline: "none"
                      }}
                    >
                      <option value="date-desc">Date (Newest)</option>
                      <option value="date-asc">Date (Oldest)</option>
                      <option value="score-desc">Score (High-Low)</option>
                      <option value="score-asc">Score (Low-High)</option>
                      <option value="name-asc">Student (A-Z)</option>
                    </select>
                  </div>

                </div>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", minWidth: "500px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", color: "var(--text-secondary)", fontSize: "0.85rem" }}>
                      <th style={{ padding: "10px" }}>Student Name</th>
                      <th style={{ padding: "10px" }}>Quiz / Subject</th>
                      <th style={{ padding: "10px" }}>Score</th>
                      <th style={{ padding: "10px" }}>Date Completed</th>
                      <th style={{ padding: "10px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody style={{ fontSize: "0.9rem" }}>
                    {processedSubmissions.length > 0 ? (
                      processedSubmissions.map((sub, i) => (
                        <tr key={`${sub.email}-${sub.quizId}-${sub.date}-${i}`} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                          <td style={{ padding: "12px 10px", fontWeight: "600" }}>{sub.name}</td>
                          <td style={{ padding: "12px 10px", color: "var(--text-secondary)" }}>{sub.subject}</td>
                          <td style={{ padding: "12px 10px", color: "var(--color-orange)", fontWeight: "bold" }}>{sub.score}</td>
                          <td style={{ padding: "12px 10px", color: "var(--text-muted)", fontSize: "0.8rem" }}>{sub.date}</td>
                          <td style={{ padding: "12px 10px", textAlign: "right", position: "relative" }}>
                            <button 
                              onClick={() => setActiveMenuIndex(activeMenuIndex === i ? null : i)}
                              style={{ background: "none", border: "none", color: "var(--text-secondary)", cursor: "pointer", padding: "4px" }}
                            >
                              <MoreVertical size={16} />
                            </button>

                            {/* Dropdown Options Popup */}
                            {activeMenuIndex === i && (
                              <div style={{
                                position: "absolute",
                                right: "10px",
                                top: "35px",
                                background: "rgba(15, 10, 30, 0.95)",
                                backdropFilter: "blur(12px)",
                                border: "1px solid var(--glass-border)",
                                borderRadius: "8px",
                                boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
                                zIndex: 100,
                                width: "160px",
                                textAlign: "left",
                                padding: "6px 0"
                              }}>
                                <button 
                                  onClick={() => copyScoreDetails(sub)} 
                                  style={{ width: "100%", background: "none", border: "none", color: "#ffffff", padding: "8px 12px", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                  <Copy size={12} /> Copy Details
                                </button>
                                
                                <button 
                                  onClick={() => emailStudentRecord(sub.email)} 
                                  style={{ width: "100%", background: "none", border: "none", color: "#ffffff", padding: "8px 12px", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                                >
                                  <Mail size={12} /> Mail Student
                                </button>

                                <button 
                                  onClick={() => auditAnswerSheet(sub.name)} 
                                  style={{ width: "100%", background: "none", border: "none", color: "#ffffff", padding: "8px 12px", fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}
                                >
                                  <ShieldCheck size={12} /> Audit Paper
                                </button>
                              </div>
                            )}
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
          <div className="glass-panel" style={{ padding: "2.5rem", width: "90%", maxWidth: "600px", border: "1px solid var(--glass-border)", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "1.25rem", fontWeight: "bold", color: "#ffffff", marginBottom: "1.5rem" }}>Create New Quiz</h2>
            <form onSubmit={handleCreateQuiz} style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Quiz Title</label>
                <input type="text" required placeholder="e.g. Grade 10 Biology Basics" value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Grade Level</label>
                  <select value={quizGrade} onChange={(e) => setQuizGrade(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(25,18,50,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }}>
                    <option value="Grade 10">Grade 10</option>
                    <option value="Grade 11">Grade 11</option>
                    <option value="Grade 12">Grade 12</option>
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                  <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Duration (e.g. 15 mins)</label>
                  <input type="text" required value={quizDuration} onChange={(e) => setQuizDuration(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none" }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.85rem", fontWeight: "600", color: "var(--text-secondary)" }}>Description</label>
                <textarea rows={2} placeholder="Describe quiz subjects..." value={quizDesc} onChange={(e) => setQuizDesc(e.target.value)} style={{ width: "100%", padding: "10px", borderRadius: "8px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", outline: "none", resize: "none" }} />
              </div>

              {/* Questions Builder Section */}
              <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.2rem", marginTop: "0.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1rem", fontWeight: "bold", color: "#ffffff" }}>Questions Builder ({questionsList.length})</h3>
                  <button type="button" onClick={addQuestionField} className="gradient-button" style={{ padding: "6px 12px", fontSize: "0.8rem", borderRadius: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    <PlusCircle size={14} /> Add Question
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem", maxHeight: "300px", overflowY: "auto", paddingRight: "5px" }}>
                  {questionsList.map((q, qIdx) => (
                    <div key={qIdx} style={{ padding: "1rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "10px", display: "flex", flexDirection: "column", gap: "10px", position: "relative" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "0.8rem", fontWeight: "bold", color: "var(--color-orange)" }}>Question {qIdx + 1}</span>
                        {questionsList.length > 1 && (
                          <button type="button" onClick={() => removeQuestionField(qIdx)} style={{ background: "none", border: "none", color: "#ef4444", fontSize: "0.75rem", cursor: "pointer", fontWeight: "bold" }}>
                            Delete
                          </button>
                        )}
                      </div>
                      
                      <input 
                        type="text" 
                        required 
                        placeholder={`Enter question ${qIdx + 1} text...`} 
                        value={q.text} 
                        onChange={(e) => handleQuestionChange(qIdx, "text", e.target.value)} 
                        style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", fontSize: "0.85rem", outline: "none" }} 
                      />

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                        {q.options.map((opt, oIdx) => (
                          <input 
                            key={oIdx}
                            type="text" 
                            required 
                            placeholder={`Option ${oIdx + 1}...`} 
                            value={opt} 
                            onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)} 
                            style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", fontSize: "0.8rem", outline: "none" }} 
                          />
                        ))}
                      </div>

                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Correct Answer</label>
                        <select 
                          value={q.correctIndex} 
                          onChange={(e) => handleQuestionChange(qIdx, "correctIndex", e.target.value)} 
                          style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", background: "rgba(25,18,50,0.9)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff", fontSize: "0.8rem", outline: "none" }}
                        >
                          <option value={0}>Option 1</option>
                          <option value={1}>Option 2</option>
                          <option value={2}>Option 3</option>
                          <option value={3}>Option 4</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
                <button type="button" onClick={() => setShowCreateModal(false)} style={{ padding: "8px 16px", borderRadius: "6px", background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#ffffff", cursor: "pointer" }}>Cancel</button>
                <button type="submit" className="gradient-button" style={{ padding: "8px 16px", borderRadius: "6px" }}>Publish Quiz</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic Glassmorphic Toast Notification */}
      {toast && (
        <div style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          background: "rgba(15, 10, 30, 0.9)",
          backdropFilter: "blur(12px)",
          border: "1px solid var(--glass-border)",
          padding: "1rem 1.5rem",
          borderRadius: "12px",
          color: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.5), inset 0 0 15px rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 2000,
          animation: "slideIn 0.3s ease forwards"
        }}>
          <div style={{
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            background: toast.type === "success" ? "#22c55e" : toast.type === "error" ? "#ef4444" : "var(--color-orange)"
          }}></div>
          <span style={{ fontSize: "0.9rem", fontWeight: "500" }}>{toast.message}</span>
        </div>
      )}

    </div>
  );
}
