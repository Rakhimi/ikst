import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getListings() {
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
        profiles: true, // Include the profile if it exists
      },
    });

    // Map the results to ensure proper formatting
    const safeUsers = usersWithProfiles.map((user) => ({
      ...user,
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
    }));

    return safeUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return an empty array instead of NextResponse to match the expected type
    return [];
  }
}