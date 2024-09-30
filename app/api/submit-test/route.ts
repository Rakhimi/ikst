import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { AnswerOption } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { answers, profileId } = body;

    if (!answers) {
      return NextResponse.json(
        { error: 'No Answers' },
        { status: 400 }
      );
    }

    await prisma.answer.createMany({
      data: Object.entries(answers).map(([questionId, option]) => ({
        profileId,
        questionId: parseInt(questionId.split('-')[1]),
        option: option as AnswerOption, // Type assertion here
      })),
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating password:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
