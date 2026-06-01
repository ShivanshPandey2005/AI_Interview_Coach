import { NextResponse } from "next/server";
import { connectDB, User, mockDb } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    const hasMongo = await connectDB();
    const hashedPassword = hashPassword(password);

    if (hasMongo) {
      // 1. Production MongoDB Flow
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date()
      });

      await newUser.save();
      return NextResponse.json(
        { message: "Registration successful! You can now log in." },
        { status: 201 }
      );
    } else {
      // 2. Resilient In-Memory Fallback Flow
      const existingMockUser = mockDb.users.find(
        (u) => u.email === email.toLowerCase()
      );
      if (existingMockUser) {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        );
      }

      const newMockUser = {
        _id: Math.random().toString(36).substring(2, 11),
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        createdAt: new Date()
      };

      mockDb.users.push(newMockUser);
      console.log("📝 Register mock user in memory storage! Users count:", mockDb.users.length);

      return NextResponse.json(
        { message: "Registration successful (Mock mode)! You can now log in." },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error("Signup Route Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
