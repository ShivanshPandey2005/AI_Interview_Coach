import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB, Interview, mockDb } from "@/lib/db";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    let interviewData = null;

    if (hasMongo) {
      // 1. Fetch from live MongoDB
      interviewData = await Interview.findOne({ _id: id, userId });
    } else {
      // 2. Fetch from In-Memory Mock database
      interviewData = mockDb.interviews.find(
        (i) => i._id === id && i.userId === userId
      );
    }

    if (!interviewData) {
      return NextResponse.json(
        { error: "Interview report not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ interview: interviewData }, { status: 200 });
  } catch (error: any) {
    console.error("Single Interview API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
