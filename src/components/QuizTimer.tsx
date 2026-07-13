"use client";

import React, { useEffect, useState } from "react";
import styles from "../app/quiz/[quizId]/quiz.module.css";

interface QuizTimerProps {
  durationSeconds: number;
  onTimeUp: () => void;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  durationSeconds,
  onTimeUp,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);

  useEffect(() => {
    setTimeLeft(durationSeconds);
  }, [durationSeconds]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, onTimeUp]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;

  const percentage = (timeLeft / durationSeconds) * 100;
  const isUrgent = timeLeft < 60;

  return (
    <div className={styles.timerContainer}>
      <div className={styles.timerHeader}>
        <span className={styles.timerLabel}>Time Remaining</span>
        <span className={`${styles.timerValue} ${isUrgent ? styles.timerUrgent : ""}`}>
          {formattedTime}
        </span>
      </div>
      <div className={styles.progressBarBg}>
        <div
          className={`${styles.progressBarFill} ${isUrgent ? styles.progressUrgent : ""}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
