import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB, Interview, mockDb } from "@/lib/db";

// Helper to format Date into clean Month-Day strings
function formatDate(dateInput: Date) {
  const d = new Date(dateInput);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

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
      // 1. Fetch from live MongoDB
      interviews = await Interview.find({ userId }).sort({ createdAt: 1 });
    } else {
      // 2. Fetch from In-Memory Mock database
      interviews = mockDb.interviews
        .filter((i) => i.userId === userId)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      // If mock database is completely empty, populate it with 4 beautiful, realistic sample
      // sessions so the dashboard immediately looks premium and alive on first login!
      if (interviews.length === 0) {
        const seedDate = new Date();
        const baseInterviews = [
          {
            _id: "mock-session-1",
            userId,
            role: "Frontend Engineer",
            difficulty: "Medium",
            type: "Technical",
            overallScore: 68,
            feedbackSummary: "Good grasp of React fundamentals but struggled with advanced state patterns and optimization strategies.",
            createdAt: new Date(seedDate.getTime() - 1000 * 60 * 60 * 24 * 8) // 8 days ago
          },
          {
            _id: "mock-session-2",
            userId,
            role: "Frontend Engineer",
            difficulty: "Medium",
            type: "Behavioral",
            overallScore: 78,
            feedbackSummary: "Demonstrated strong communication using the STAR framework. Competency answers were concise and relevant.",
            createdAt: new Date(seedDate.getTime() - 1000 * 60 * 60 * 24 * 5) // 5 days ago
          },
          {
            _id: "mock-session-3",
            userId,
            role: "Fullstack Engineer",
            difficulty: "Hard",
            type: "Technical",
            overallScore: 82,
            feedbackSummary: "Impressive database design logic and concurrency handling. Areas of improvement include edge-case authentication checks.",
            createdAt: new Date(seedDate.getTime() - 1000 * 60 * 60 * 24 * 2) // 2 days ago
          },
          {
            _id: "mock-session-4",
            userId,
            role: "Software Developer",
            difficulty: "Hard",
            type: "HR & Core",
            overallScore: 89,
            feedbackSummary: "Stellar performance. Highly confident articulation, strong alignment with culture values, and outstanding problem-solving.",
            createdAt: new Date(seedDate.getTime() - 1000 * 60 * 120) // 2 hours ago
          }
        ];

        mockDb.interviews.push(...baseInterviews);
        interviews = baseInterviews;
        console.log("🌱 Seeded mock database with 4 premium sessions for dashboard!");
      }
    }

    // --- CALCULATE STATS ---
    const totalInterviews = interviews.length;
    let avgScore = 0;
    let bestScore = 0;
    let improvement = 0; // percentage comparison of last attempt vs first

    if (totalInterviews > 0) {
      const scores = interviews.map((i) => i.overallScore);
      avgScore = Math.round(scores.reduce((a, b) => a + b, 0) / totalInterviews);
      bestScore = Math.max(...scores);

      if (totalInterviews > 1) {
        const firstScore = interviews[0].overallScore;
        const lastScore = interviews[totalInterviews - 1].overallScore;
        improvement = Math.round(((lastScore - firstScore) / (firstScore || 1)) * 100);
      } else {
        // Single attempt improvement indicator placeholder
        improvement = 5; 
      }
    }

    // Compile Recent sessions list (Newest first, max 5)
    const recent = [...interviews]
      .reverse()
      .slice(0, 5)
      .map((i) => ({
        id: i._id.toString(),
        role: i.role,
        difficulty: i.difficulty,
        type: i.type,
        overallScore: i.overallScore,
        createdAt: formatDate(i.createdAt)
      }));

    // Compile chartCoordinates (Oldest to Newest for chronological order)
    const chartData = interviews.map((i) => ({
      date: formatDate(i.createdAt),
      score: i.overallScore,
      role: i.role
    }));

    return NextResponse.json({
      stats: {
        totalInterviews,
        avgScore,
        bestScore,
        improvement
      },
      recent,
      chartData,
      dbMode: hasMongo ? "live" : "mock"
    });
  } catch (error: any) {
    console.error("Dashboard API Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
