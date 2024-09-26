import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password, maiden, sport, color } = body;

  try {
    // Check if the email is already taken
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const user = await prisma.user.create({
      data: {
        email,
        hashedPassword,
        maiden,
        sport,
        color,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error during user creation:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
