import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getIndividualListing() {
  try {
    
    const currentUser = await getCurrentUser();
    
    
    if (!currentUser) {
      return null; 
    }

    
    const userWithProfiles = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      include: {
        profiles: true, 
      },
    });

    
    if (!userWithProfiles || userWithProfiles.profiles.length === 0) {
      return null;
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
