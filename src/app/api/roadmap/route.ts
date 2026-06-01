import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB, ResumeAnalysis, Interview, SkillRoadmap, mockDb } from "@/lib/db";
import { generateSkillRoadmap } from "@/lib/gemini";

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
    const hasMongo = await connectDB();

    let latestResume = null;
    let latestInterview = null;

    if (hasMongo) {
      // 1. Fetch latest from MongoDB
      latestResume = await ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 });
      latestInterview = await Interview.findOne({ userId }).sort({ createdAt: -1 });
    } else {
      // 2. Fetch latest from In-Memory Mock db
      latestResume = mockDb.resumes
        .filter((r) => r.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;

      latestInterview = mockDb.interviews
        .filter((i) => i.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
    }

    // Extrapolate lists, providing high-quality fallbacks if user hasn't uploaded a resume or completed an interview yet
    const resumeGaps = latestResume?.missingSkills || ["Containerization (Docker/Kubernetes)", "API Rate Limiting", "CI/CD automations"];
    const interviewWeaknesses = latestInterview 
      ? latestInterview.questions.flatMap((q: any) => q.weaknesses) 
      : ["Explaining database trade-offs under high concurrency", "Structuring behavioral answers in STAR sequence"];
    
    const role = latestInterview?.role || latestResume?.fileName?.includes("PM") ? "Product Manager" : "Software Engineer";

    // Call Gemini SDK roadmap generation helper
    const roadmap = await generateSkillRoadmap(resumeGaps, interviewWeaknesses, role);

    const roadmapData = {
      userId,
      role: roadmap.role,
      missingSkills: roadmap.missingSkills,
      weeklyRoadmap: roadmap.weeklyRoadmap,
      createdAt: new Date()
    };

    let savedId = "";
    if (hasMongo) {
      // 1. Production MongoDB Persist (Clear previous to keep latest active)
      await SkillRoadmap.deleteMany({ userId });
      const newRoadmap = new SkillRoadmap(roadmapData);
      const savedDoc = await newRoadmap.save();
      savedId = savedDoc._id.toString();
    } else {
      // 2. Resilient In-Memory Fallback Persist
      const mockId = "mock-roadmap-" + Math.random().toString(36).substring(2, 11);
      const newMockRoadmap = {
        _id: mockId,
        ...roadmapData
      };
      mockDb.roadmaps = mockDb.roadmaps.filter((r) => r.userId !== userId);
      mockDb.roadmaps.push(newMockRoadmap);
      savedId = mockId;
      console.log("📝 Saved mock skill roadmap in-memory! Roadmaps count:", mockDb.roadmaps.length);
    }

    return NextResponse.json({
      id: savedId,
      roadmap: roadmapData
    }, { status: 200 });
  } catch (error: any) {
    console.error("Roadmap API Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fetch user's active roadmap
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

    let roadmapData = null;
    if (hasMongo) {
      roadmapData = await SkillRoadmap.findOne({ userId }).sort({ createdAt: -1 });
    } else {
      roadmapData = mockDb.roadmaps
        .filter((r) => r.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
    }

    return NextResponse.json({ roadmap: roadmapData }, { status: 200 });
  } catch (error: any) {
    console.error("Roadmap Fetch API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
