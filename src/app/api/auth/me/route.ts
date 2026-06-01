import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { connectDB, User, mockDb } from "@/lib/db";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const tokenCookie = cookieStore.get("token");
    const token = tokenCookie?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized. No token found." },
        { status: 401 }
      );
    }

    const payload = await verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Unauthorized. Invalid token." },
        { status: 401 }
      );
    }

    const hasMongo = await connectDB();
    let userData = null;

    if (hasMongo) {
      // Fetch user from MongoDB
      const user = await User.findById(payload.userId).select("-password");
      if (user) {
        userData = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        };
      }
    } else {
      // Find in mock database
      const mockUser = mockDb.users.find((u) => u._id === payload.userId);
      if (mockUser) {
        userData = {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          createdAt: mockUser.createdAt
        };
      }
    }

    if (!userData) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error: any) {
    console.error("Auth Me API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
