import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import { AnswerOption } from "@prisma/client"; // Import the enum from Prisma

interface Answer {
  questionId: string;  // Assuming questionId is a string
  answer?: AnswerOption; // Allow answer to be optional
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { profileId, questionSetId, answers }: { profileId: number, questionSetId: number, answers: Answer[] } = body;

    // Ensure the answers array exists
    if (!answers) {
      return NextResponse.json({ error: "Answers are missing" }, { status: 400 });
    }

    // Create the AnswerSet
    const answerSet = await prisma.answerSet.create({
      data: {
        profileId,  // Use profileId from the request body
        questionSetId,  // Use questionSetId from the request body
        answers: {
          create: answers.map(({ questionId, answer }: Answer) => ({
            option: answer || AnswerOption.UNANSWERED,  // Use NO_ANSWER if no answer is provided
            question: {
              connect: {
                id: parseInt(questionId, 10),  // Convert questionId to an integer if necessary
              },
            },
          })),
        },
      },
    });

    // Return the created answerSet
    return NextResponse.json({ answerSet }, { status: 201 });

  } catch (error) {
    console.error("Error submitting answers:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
