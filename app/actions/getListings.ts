import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getListings() {
  try {
    // Fetch current user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return [];
    }

    // Fetch users with their profiles and answer sets
    const usersWithProfiles = await prisma.user.findMany({
      orderBy: {
        createdAt: 'asc',
      },
      include: {
        profiles: {
          include: {
            answerSets: true, // Include the answer sets for the profile
          },
        },
      },
    });

    // Map the results to include the count of answer sets
    const safeUsers = usersWithProfiles.map((user) => ({
      ...user,
      createdAt: user.createdAt.toString(),
      updatedAt: user.updatedAt.toString(),
      profiles: user.profiles.map((profile) => ({
        ...profile,
        answerCount: profile.answerSets.length, // Count of answer sets
      })),
    }));

    return safeUsers;
  } catch (error) {
    console.error('Error fetching users:', error);
    // Return an empty array instead of NextResponse to match the expected type
    return [];
  }
}
