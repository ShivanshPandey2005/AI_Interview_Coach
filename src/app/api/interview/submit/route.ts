import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB, Interview, mockDb } from "@/lib/db";
import { evaluateInterviewAnswers } from "@/lib/gemini";

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = payload.userId;
    const { role, difficulty, type, questions, answers } = await req.json();

    if (!role || !difficulty || !type || !questions || !answers) {
      return NextResponse.json(
        { error: "Role, difficulty, type, questions, and answers are required" },
        { status: 400 }
      );
    }

    if (questions.length !== 10 || answers.length !== 10) {
      return NextResponse.json(
        { error: "Must submit answers for exactly 10 questions" },
        { status: 400 }
      );
    }

    // Call Gemini AI multidimensional grading helper
    const evaluation = await evaluateInterviewAnswers(
      role,
      difficulty,
      type,
      questions,
      answers
    );

    const hasMongo = await connectDB();
    let savedId = "";

    const interviewData = {
      userId,
      role,
      difficulty,
      type,
      questions: evaluation.questions,
      overallScore: evaluation.overallScore,
      feedbackSummary: evaluation.feedbackSummary,
      createdAt: new Date()
    };

    if (hasMongo) {
      // 1. Production MongoDB Persist
      const newInterview = new Interview(interviewData);
      const savedDoc = await newInterview.save();
      savedId = savedDoc._id.toString();
    } else {
      // 2. Resilient In-Memory Fallback Persist
      const mockId = "mock-eval-" + Math.random().toString(36).substring(2, 11);
      const newMockInterview = {
        _id: mockId,
        ...interviewData
      };
      mockDb.interviews.push(newMockInterview);
      savedId = mockId;
      console.log("📝 Saved mock interview report in-memory! Interviews count:", mockDb.interviews.length);
    }

    return NextResponse.json({ id: savedId, evaluation }, { status: 200 });
  } catch (error: any) {
    console.error("Submit API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
