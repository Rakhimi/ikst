import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getUserList() {
  try {
    // Fetch current user

    const currentUser = await getCurrentUser();
        
    if (!currentUser) {
      return null; 
    }

    const users = await prisma.user.findMany({
        orderBy: {
          createdAt: 'asc',
        },
      });
    

    if (!users) {
      throw new Error('Users not found');
    }

    return users
  } catch (error) {
    console.error('Error fetching users:', error);
    // Handle the error appropriately (e.g., throw, return null, etc.)
    throw new Error('Failed to retrieve Users');
  }
}
