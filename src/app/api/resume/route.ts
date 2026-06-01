import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB, ResumeAnalysis, mockDb } from "@/lib/db";
import { analyzeResumeContent } from "@/lib/gemini";

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
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // --- STEP 1: RESILIENT PDF TEXT EXTRACTION ---
    let extractedText = "";
    try {
      console.log(`📂 Extracting text from PDF: ${fileName} (${file.size} bytes)...`);
      const pdfParse = require("pdf-parse");
      const parsedData = await pdfParse(buffer);
      extractedText = parsedData.text;
    } catch (parseError) {
      console.error("⚠️ pdf-parse library error, attempting basic text extraction backup:", parseError);
      
      // Fallback: Extract all printable ASCII and simple spacing from the binary stream
      const rawString = buffer.toString("binary");
      extractedText = rawString
        .replace(/[^\x20-\x7E\n\r\t]/g, " ") // replace non-printables
        .replace(/\s+/g, " ")               // collapse spacing
        .substring(0, 10000);               // cap at 10k characters
    }

    if (!extractedText || extractedText.trim().length < 50) {
      extractedText = `Extracted Metadata: File ${fileName} contains minimal text. Analyzing resume index details.`;
    }

    // --- STEP 2: CALL GEMINI FOR ATS COMPATIBILITY AUDIT ---
    const analysis = await analyzeResumeContent(extractedText);

    // --- STEP 3: PERSIST RESULTS TO DATABASE ---
    const hasMongo = await connectDB();
    const resumeData = {
      userId,
      fileName,
      atsScore: analysis.atsScore,
      summary: analysis.summary,
      strengths: analysis.strengths,
      weaknesses: analysis.weaknesses,
      missingSkills: analysis.missingSkills,
      suggestions: analysis.suggestions,
      createdAt: new Date()
    };

    let savedId = "";
    if (hasMongo) {
      // 1. Production MongoDB Persist
      const newAnalysis = new ResumeAnalysis(resumeData);
      const savedDoc = await newAnalysis.save();
      savedId = savedDoc._id.toString();
    } else {
      // 2. Resilient In-Memory Fallback Persist
      const mockId = "mock-ats-" + Math.random().toString(36).substring(2, 11);
      const newMockAnalysis = {
        _id: mockId,
        ...resumeData
      };
      
      // Clear previous resumes for this user to keep dashboard latest
      mockDb.resumes = mockDb.resumes.filter((r) => r.userId !== userId);
      mockDb.resumes.push(newMockAnalysis);
      savedId = mockId;
      console.log("📝 Saved mock resume report in-memory! Resumes count:", mockDb.resumes.length);
    }

    return NextResponse.json({
      id: savedId,
      analysis: resumeData
    }, { status: 200 });
  } catch (error: any) {
    console.error("Resume Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error during PDF audit" },
      { status: 500 }
    );
  }
}

// Fetch the user's latest parsed resume analysis
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

    let resumeData = null;
    if (hasMongo) {
      resumeData = await ResumeAnalysis.findOne({ userId }).sort({ createdAt: -1 });
    } else {
      resumeData = mockDb.resumes
        .filter((r) => r.userId === userId)
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0] || null;
    }

    return NextResponse.json({ resume: resumeData }, { status: 200 });
  } catch (error: any) {
    console.error("Resume Fetch API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
