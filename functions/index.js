const functions = require("firebase-functions");

exports.quizSubmit = functions.https.onRequest((req, res) => {
  // CORS configuration to allow your frontend and Postman to hit it
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed. Use POST." });
  }

  try {
    const { name, email, quizId, subject, score, date, status } = req.body;

    if (!name || !email || !quizId || !score) {
      return res.status(400).json({ error: "Missing required fields: name, email, quizId, or score." });
    }

    const scoreValue = parseInt(String(score).replace("%", "")) || 0;
    const xpAwarded = scoreValue * 10;
    const submissionId = `${Date.now()}_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;

    return res.status(200).json({
      message: "Quiz graded and submitted successfully via Cloud Functions!",
      xpAwarded: xpAwarded,
      submissionData: {
        id: submissionId,
        name,
        email,
        quizId,
        subject: subject || "General Quiz",
        score,
        date: date || new Date().toISOString().replace("T", " ").substring(0, 16),
        status: status || "Approved"
      }
    });
  } catch (error) {
    console.error("Quiz submission API error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});
