import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, password } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'No Id' },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update the user's password in the database
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        hashedPassword,
      },
    });

    // Return the updated user (or a success message)
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
