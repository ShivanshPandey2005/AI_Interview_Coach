import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { generateInterviewQuestions } from "@/lib/gemini";

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

    const { role, difficulty, type } = await req.json();

    if (!role || !difficulty || !type) {
      return NextResponse.json(
        { error: "Role, difficulty, and type are required parameters" },
        { status: 400 }
      );
    }

    // Call Gemini SDK questions generation helper
    const questions = await generateInterviewQuestions(role, difficulty, type);

    return NextResponse.json({ questions }, { status: 200 });
  } catch (error: any) {
    console.error("Questions API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
