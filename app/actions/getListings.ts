import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";
import { NextResponse } from "next/server";

export default async function getListing() {
  try {
    // Fetch current user
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return [];
    }

    // Fetch users with their profiles (if available)
    const usersWithProfiles = await prisma.user.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        profile: true, // Include the profile if it exists
      },
    });

    // Map the results to ensure proper formatting
    const safeUsers = usersWithProfiles.map((user) => ({
      ...user,
      createdAt: user.createdAt.toString(),
      profile: user.profile || null, // Set profile to null if not available
    }));

    return safeUsers;
  } catch (error:any) {
    throw new Error(error.message || 'Error fetching users');
  }
}
