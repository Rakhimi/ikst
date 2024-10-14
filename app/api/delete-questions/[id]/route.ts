import { NextResponse } from 'next/server';
import prisma from '@/lib/prismadb';
import getCurrentUser from '@/app/actions/getCurrentUser';

export async function DELETE(request: Request) {
  try {
    // Extract the question set ID from the URL path
    const url = new URL(request.url);
    const id = parseInt(url.pathname.split('/').pop() || '', 10);

    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    // Get the current user
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

  
    const questionSet = await prisma.questionSet.findUnique({
      where: { id },

    });

    if (!questionSet) {
      return NextResponse.json({ error: 'Question set not found' }, { status: 404 });
    }

    // Now, delete the QuestionSet
    await prisma.questionSet.delete({
      where: { id: questionSet.id },
    });

    return NextResponse.json({ success: true, message: 'Question set deleted successfully' });
    
  } catch (error) {
    console.error('Error deleting question set:', error);
    return NextResponse.json({ error: 'An error occurred while deleting the question set' }, { status: 500 });
  }
}
