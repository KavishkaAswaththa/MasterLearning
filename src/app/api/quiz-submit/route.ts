import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, quizId, subject, score, date, status } = body;

    // Validate required fields
    if (!name || !email || !quizId || !score) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, quizId, or score.' },
        { status: 400 }
      );
    }

    // Server-side grading & XP allocation logic (simulated for the API requirement)
    const scoreValue = parseInt(score.replace('%', '')) || 0;
    const xpAwarded = scoreValue * 10;
    
    // In a full production app, you would use 'firebase-admin' SDK here to write to Firestore,
    // rather than the client 'firebase' SDK, to avoid module bundling errors on the server.
    const submissionId = `${Date.now()}_${email.replace(/[^a-zA-Z0-9]/g, "_")}`;

    return NextResponse.json({
      message: 'Quiz graded and submitted successfully!',
      xpAwarded: xpAwarded,
      submissionData: {
        id: submissionId,
        name,
        email,
        quizId,
        subject: subject || 'General Quiz',
        score,
        date: date || new Date().toISOString().replace('T', ' ').substring(0, 16),
        status: status || 'Approved'
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error('Quiz submission API error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', details: error.message },
      { status: 500 }
    );
  }
}
