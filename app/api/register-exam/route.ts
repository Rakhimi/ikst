import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/prismadb";
import { authOptions } from "@/lib/authOptions";

// Function to get the session
export async function getSession() {
  return await getServerSession(authOptions);
}

// Function to handle POST requests
export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, school, grade } = body;

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

    // Get the session
    const session = await getSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find the current user by their email
    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email as string,
      }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Use a transaction to create a profile and update the user
    const [profile] = await prisma.$transaction(async (prisma) => {
      const newProfile = await prisma.profile.create({
        data: {
          name,
          school,
          grade,
          userId: currentUser.id,  // Link the profile to the authenticated user
        },
      });

      await prisma.user.update({
        where: { id: currentUser.id },
        data: { profileId: newProfile.id }, // Set the profileId to link to the existing profile
      });

      return [newProfile];
    });

    // Return the created profile
    return NextResponse.json(profile);
  } catch (error) {
    // Handle any errors that occur
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
