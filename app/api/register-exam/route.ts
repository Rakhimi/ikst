import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

// Define the type for the profile object
type Profile = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  school: string;
  grade: string;
  userId: number;
};

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, school, grade } = body;

    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Validate the input data
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (!school || typeof school !== 'string' || school.trim() === '') {
      return NextResponse.json({ error: 'Invalid school' }, { status: 400 });
    }
    if (!grade || typeof grade !== 'string' || grade.trim() === '') {
      return NextResponse.json({ error: 'Invalid grade' }, { status: 400 });
    }

    // Use a transaction to create a profile and update the user
    const newProfile = await prisma.$transaction(async (prisma) => {
      const profile = await prisma.profile.create({
        data: {
          name,
          school,
          grade,
          userId: currentUser.id,
        },
      });

      await prisma.user.update({
        where: { id: currentUser.id },
        data: { profileId: profile.id },
      });

      return profile;
    });

    // Return the created profile
    return NextResponse.json(newProfile as Profile); // Ensure TypeScript knows the returned type
  } catch (error) {
    // Handle any errors that occur
    console.error('Error creating profile:', error);
    return NextResponse.error();
  }
}
