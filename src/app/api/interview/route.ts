import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB, Interview, mockDb } from "@/lib/db";

export async function GET() {
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
    const hasMongo = await connectDB();

    let interviews = [];

    if (hasMongo) {
      // 1. Fetch from live MongoDB (Sorted newest first)
      interviews = await Interview.find({ userId }).sort({ createdAt: -1 });
    } else {
      // 2. Fetch from In-Memory Mock database
      interviews = mockDb.interviews
        .filter((i) => i.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const list = interviews.map((i) => ({
      id: i._id.toString(),
      role: i.role,
      difficulty: i.difficulty,
      type: i.type,
      overallScore: i.overallScore,
      feedbackSummary: i.feedbackSummary,
      createdAt: new Date(i.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
    }));

    return NextResponse.json({ interviews: list }, { status: 200 });
  } catch (error: any) {
    console.error("Fetch Interviews History API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
