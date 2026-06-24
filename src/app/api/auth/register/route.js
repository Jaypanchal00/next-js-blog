import { NextResponse } from "next/server";
import { registerUser } from "@/lib/store";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validation
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    // Call store
    const user = registerUser({ name: name.trim(), email: email.trim(), password });

    return NextResponse.json(
      { message: "Registration successful!", user },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message || "Something went wrong." }, { status: 400 });
  }
}
