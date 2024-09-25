import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getIndividualListing() {
  try {
    // Fetch current user
    const currentUser = await getCurrentUser();
    
    // Return an empty array if no user is logged in
    if (!currentUser) {
      return null;  // Return null when no current user is found
    }

    // Find the user with profiles by their unique ID
    const userWithProfiles = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      include: {
        profiles: true, // Include the profile if it exists
      },
    });

    // If the user is not found, return an empty array
    if (!userWithProfiles || userWithProfiles.profiles.length === 0) {
      return null;  // Return null when there are no profiles
    }

    // Transform the result into a "safe" format
    const safeUser = {
      ...userWithProfiles,
      createdAt: userWithProfiles.createdAt.toString(),
      updatedAt: userWithProfiles.updatedAt.toString(),
    };

    return safeUser;
  } catch (error) {
    console.error('Error fetching individual user:', error);
    return null;
  }
}
