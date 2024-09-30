import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getProfileId(code: string) {
  try {
    // Fetch current user
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      throw new Error('User not authenticated');
    }

    // Fetch profile based on code
    const profile = await prisma.profile.findUnique({
      where: {
        code: code,
      },
    });

    // Check if the profile exists
    if (!profile) {
      throw new Error('Profile not found');
    }

    return profile.id; // Return only the profile ID if needed
  } catch (error) {
    console.error('Error fetching profile:', error);
    // Handle the error appropriately (e.g., throw, return null, etc.)
    throw new Error('Failed to retrieve profile ID');
  }
}
