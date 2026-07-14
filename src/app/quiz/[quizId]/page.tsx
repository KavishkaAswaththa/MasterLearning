"use client";

import React, { use, useEffect, useState } from "react";
import Link from "next/link";
import { sampleQuizzes } from "@/data/quizzes";
import { QuizTimer } from "@/components/QuizTimer";
import { submitQuizResult } from "@/lib/db";
import styles from "./quiz.module.css";

interface QuizPageProps {
  params: Promise<{ quizId: string }>;
}

export default function QuizPage({ params }: QuizPageProps) {
  const resolvedParams = use(params);
  const quizId = resolvedParams.quizId;

  const quiz = sampleQuizzes.find((q) => q.id === quizId);

  // States
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [score, setScore] = useState(0);
  const [timeTaken, setTimeTaken] = useState(0);
  const [startTime] = useState<number>(() => Date.now());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const user = localStorage.getItem("user");
      if (!user) {
        window.location.href = "/login?error=auth_required";
      }
    }
  }, []);

  if (!isMounted) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.errorText}>Loading assessment portal...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className={styles.loadingContainer}>
        <h2 className={styles.errorTitle}>Assessment Not Found</h2>
        <p className={styles.errorText}>
          The requested quiz ID &quot;{quizId}&quot; does not exist in our catalog.
        </p>
        <div style={{ marginTop: "1.5rem" }}>
          <p style={{ marginBottom: "1rem", color: "#9ca3af" }}>Available Assessments:</p>
          <div style={{ display: "flex", gap: "1rem" }}>
            {sampleQuizzes.map((q) => (
              <Link key={q.id} href={`/quiz/${q.id}`} className={styles.backButton}>
                {q.subject} - {q.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = quiz.questions.length;
  const isComplete = answeredCount === totalQuestions;

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const calculateResults = () => {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (answers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const elapsed = Math.round((Date.now() - startTime) / 1000);
    const cappedElapsed = Math.min(elapsed, quiz.durationSeconds);

    setScore(correctCount);
    setTimeTaken(cappedElapsed);
    setSubmitted(true);
    setShowConfirmModal(false);

    // Save dynamic submission to the unified database
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        const percentScore = `${Math.round((correctCount / quiz.questions.length) * 100)}%`;
        
        submitQuizResult({
          name: u.name,
          email: u.email,
          quizId: quiz.id,
          subject: `${quiz.subject} - ${quiz.title}`,
          score: percentScore,
          date: new Date().toISOString().replace("T", " ").substring(0, 16),
          status: "Approved"
        });
      }
    }
  };

  const handleManualSubmit = () => {
    setShowConfirmModal(true);
  };

  const handleAutoSubmit = () => {
    calculateResults();
  };

  const handleReset = () => {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
    setTimeTaken(0);
  };

  // Score circular indicator parameters
  const scorePercentage = (score / totalQuestions) * 100;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scorePercentage / 100) * circumference;

  // Visual success levels
  let resultHeading = "Keep Practicing!";
  let resultMsg = "You've completed the assessment, but there's room to improve. Review the feedback and try again.";
  if (scorePercentage >= 80) {
    resultHeading = "Excellent Job!";
    resultMsg = "Superb performance! You've mastered this topic. You are ready to move to the next chapter.";
  } else if (scorePercentage >= 50) {
    resultHeading = "Good Effort!";
    resultMsg = "You passed! Review the incorrect answers below to consolidate your understanding.";
  }

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}m ${remainingSecs.toString().padStart(2, "0")}s`;
  };

  return (
    <div className={styles.quizWrapper}>
      <div className={styles.quizContainer}>
        {/* Top Header Card */}
        <div className={`${styles.glassCard}`}>
          <div className={styles.headerBar}>
            <Link href="/dashboard" className={styles.backButton}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
              </svg>
              Dashboard
            </Link>
            <span className={styles.badge}>{quiz.grade}</span>
          </div>
          <h1 className={styles.quizTitle}>{quiz.title}</h1>
          <p className={styles.quizDesc}>{quiz.description}</p>
        </div>

        {!submitted ? (
          <>
            {/* Countdown Timer */}
            <QuizTimer durationSeconds={quiz.durationSeconds} onTimeUp={handleAutoSubmit} />

            {/* Questions Form */}
            <div className={`${styles.glassCard} ${styles.questionSection}`}>
              <div className={styles.quizProgressHeader}>
                <span>
                  Question {answeredCount} of {totalQuestions} Answered
                </span>
                <span className={styles.progressPercentText}>
                  {Math.round((answeredCount / totalQuestions) * 100)}% Complete
                </span>
              </div>
              <div className={styles.progressBarBg}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
                />
              </div>

              {quiz.questions.map((q, idx) => (
                <div key={q.id} className={styles.questionItem}>
                  <span className={styles.questionNumber}>Question {idx + 1}</span>
                  <p className={styles.questionText}>{q.text}</p>
                  <div className={styles.optionsGrid}>
                    {q.options.map((option, optIdx) => {
                      const isSelected = answers[q.id] === optIdx;
                      return (
                        <label
                          key={optIdx}
                          className={`${styles.optionLabel} ${
                            isSelected ? styles.optionSelected : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${q.id}`}
                            checked={isSelected}
                            onChange={() => handleSelectOption(q.id, optIdx)}
                            className={styles.radioInput}
                          />
                          <span className={styles.optionText}>{option}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Submit panel */}
              <div className={styles.submitSection}>
                {!isComplete && (
                  <span className={styles.unansweredWarning}>
                    * You have {totalQuestions - answeredCount} unanswered questions
                  </span>
                )}
                <button
                  onClick={handleManualSubmit}
                  className={styles.gradientButton}
                  disabled={answeredCount === 0}
                >
                  Submit Quiz
                </button>
              </div>
            </div>
          </>
        ) : (
          /* Results dashboard */
          <div className={styles.glassCard}>
            <div className={styles.resultDashboard}>
              <span className={styles.badge}>{quiz.subject} Result</span>
              <h2 className={styles.resultTitle}>{resultHeading}</h2>
              <p className={styles.resultSubtitle}>{resultMsg}</p>

              {/* Circular score display */}
              <div className={styles.scoreCircleContainer}>
                <svg className={styles.svgRing}>
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8a2be2" />
                      <stop offset="100%" stopColor="#ff4500" />
                    </linearGradient>
                  </defs>
                  <circle
                    className={styles.ringBg}
                    cx="90"
                    cy="90"
                    r={radius}
                  />
                  <circle
                    className={styles.ringFill}
                    cx="90"
                    cy="90"
                    r={radius}
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className={styles.scoreTextContainer}>
                  <span className={styles.scoreValue}>{score}</span>
                  <span className={styles.scoreMax}>/ {totalQuestions} Correct</span>
                </div>
              </div>

              {/* Detailed metrics */}
              <div className={styles.metricsRow}>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{Math.round(scorePercentage)}%</div>
                  <div className={styles.metricLabel}>Accuracy</div>
                </div>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{formatTime(timeTaken)}</div>
                  <div className={styles.metricLabel}>Time Taken</div>
                </div>
              </div>

              {/* Review detailed answers */}
              <h3 className={styles.reviewHeader}>Detailed Assessment Review</h3>
              <div className={styles.reviewList}>
                {quiz.questions.map((q, idx) => {
                  const userAnswer = answers[q.id];
                  const isCorrect = userAnswer === q.correctOptionIndex;
                  return (
                    <div
                      key={q.id}
                      className={`${styles.reviewItem} ${
                        isCorrect ? styles.reviewItemCorrect : styles.reviewItemIncorrect
                      }`}
                    >
                      <div className={styles.reviewQuestionHeader}>
                        <h4 className={styles.reviewQuestionText}>
                          {idx + 1}. {q.text}
                        </h4>
                        <span
                          className={`${styles.statusIndicator} ${
                            isCorrect ? styles.statusCorrect : styles.statusIncorrect
                          }`}
                        >
                          {isCorrect ? "Correct" : "Incorrect"}
                        </span>
                      </div>

                      <div className={styles.reviewChoices}>
                        {q.options.map((option, optIdx) => {
                          const isUserSel = userAnswer === optIdx;
                          const isCorrSel = q.correctOptionIndex === optIdx;

                          let choiceStyle = styles.choiceDefault;
                          if (isUserSel && isCorrect) {
                            choiceStyle = styles.choiceCorrectSelected;
                          } else if (isUserSel && !isCorrect) {
                            choiceStyle = styles.choiceIncorrectSelected;
                          } else if (isCorrSel) {
                            choiceStyle = styles.choiceCorrectUnselected;
                          }

                          return (
                            <div key={optIdx} className={`${styles.reviewChoice} ${choiceStyle}`}>
                              <span style={{ fontSize: "1.1rem" }}>
                                {isUserSel && isCorrect && "✓"}
                                {isUserSel && !isCorrect && "✗"}
                                {!isUserSel && isCorrSel && "✦"}
                              </span>
                              <span>{option}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className={styles.reviewExplanation}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    </div>
                  );
                })}
              </div>

              <button onClick={handleReset} className={styles.retryButton}>
                Re-take Assessment
              </button>
            </div>
          </div>
        )}

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3 className={styles.modalTitle}>Submit Assessment?</h3>
              <p className={styles.modalDescription}>
                {isComplete
                  ? "Are you sure you want to finish and submit your answers for evaluation? You won't be able to edit them after submission."
                  : `You have left ${
                      totalQuestions - answeredCount
                    } questions unanswered. Are you sure you want to submit and end the test now?`}
              </p>
              <div className={styles.modalButtons}>
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className={styles.cancelButton}
                >
                  Go Back
                </button>
                <button onClick={calculateResults} className={styles.confirmButton}>
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
