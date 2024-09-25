import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '', 10); // Extract ID from the URL path
    
    // Get the current user
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the profile
    await prisma.profile.delete({
      where: {
        id: id, // Ensure ID is an integer
      },
    });

    return NextResponse.json({ success: true, message: 'Profile deleted successfully' });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while deleting the profile' }, { status: 500 });
  }
}
