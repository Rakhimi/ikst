import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { UserRole } from '@prisma/client';

interface FormValues {
  role: UserRole;
  id: number
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, id }: FormValues = body;

    // Get the current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (currentUser.role === UserRole.USER) {
      return NextResponse.json({ error: "Not an Admin" }, { status: 401 });
    }

    // Update the user role in the database
    const updatedUser = await prisma.user.update({
      where: { id: id},
      data: { role },
    });

    return NextResponse.json(updatedUser, { status: 200 });

  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
