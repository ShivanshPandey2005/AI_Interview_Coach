import { NextResponse } from "next/server";
import { connectDB, User, mockDb } from "@/lib/db";
import { comparePassword, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const hasMongo = await connectDB();
    let authenticatedUser = null;

    if (hasMongo) {
      // 1. Production MongoDB flow
      const user = await User.findOne({ email: email.toLowerCase() });
      if (user && comparePassword(password, user.password)) {
        authenticatedUser = {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        };
      }
    } else {
      // 2. Resilient In-Memory Fallback flow
      const mockUser = mockDb.users.find(
        (u) => u.email === email.toLowerCase()
      );
      if (mockUser && comparePassword(password, mockUser.password)) {
        authenticatedUser = {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email
        };
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Sign Edge-Safe Web Crypto JWT Token
    const token = await signToken({
      userId: authenticatedUser.id,
      name: authenticatedUser.name,
      email: authenticatedUser.email
    });

    const response = NextResponse.json(
      {
        message: "Login successful!",
        user: {
          name: authenticatedUser.name,
          email: authenticatedUser.email
        }
      },
      { status: 200 }
    );

    // Set cookie on response
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/"
    });

    return response;
  } catch (error: any) {
    console.error("Login Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
