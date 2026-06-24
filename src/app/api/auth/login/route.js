import { NextResponse } from "next/server";
import { authenticateUser } from "@/lib/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ error: "Password is required." }, { status: 400 });
    }

    // Authenticate
    const session = authenticateUser({ email: email.trim(), password });

    return NextResponse.json(
      { message: "Login successful!", ...session },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Invalid credentials." },
      { status: 401 }
    );
  }
}
