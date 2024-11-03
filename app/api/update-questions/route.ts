import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

enum AnswerOption {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

enum GradeOption {
  GR3 = 'GR3',
  GR7 = 'GR7'
}

enum TypeOption {
  Islamic = 'Islamic',
  Quran = 'Quran'
}

interface Question {
  id?: number;  // Optional, as new questions won't have an id yet
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: AnswerOption;
}

interface FormValues {
  questions: Question[];
  title: string;
  grade: GradeOption;
  type: TypeOption;
  startTime: string; // We'll store it as a string, then combine date & time
  endTime: string;
}

export async function POST(request: Request) {
  try {
    // Parse the incoming request body
    const body = await request.json();

    // Destructure questions and title from the request body
    const { questions, title, id, grade, type, startTime, endTime }: FormValues & { id: number } = body;

    // Get the current user (assuming this function gets user data from the session)
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Step 1: Upsert the questions (create or update)
    const updatedQuestions = await Promise.all(
      questions.map((question) => {
        return prisma.question.upsert({
          where: { id: question.id || 0 }, // Use `0` for new questions (which won't exist in the DB)
          create: {
            question: question.question,
            option1: question.option1,
            option2: question.option2,
            option3: question.option3,
            option4: question.option4,
            answer: question.answer,
            questionSet: {
              connect: { id }, // Connect the question to the parent questionSet using the `id` of the questionSet
            },
          },
          update: {
            question: question.question,
            option1: question.option1,
            option2: question.option2,
            option3: question.option3,
            option4: question.option4,
            answer: question.answer,
          },
        });
      })
    );

    const updatedQuestionIds = updatedQuestions.map((q) => q.id);

    await prisma.question.deleteMany({
      where: {
        id: {
          notIn: updatedQuestionIds, // Delete any question that doesn't exist in the new list
        },
        questionSetId: id, // Ensure we are only deleting questions from the current question set
      },
    });

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    // Step 4: Update the questionSet (if needed)
    const updatedQuestionSet = await prisma.questionSet.update({
      where: { id },  // Where clause for the question set
      data: {
        title,
        grade,
        type,
        startTime: startDate,
        endTime: endDate
      },
    });

    // Return the updated question set as a response
    return NextResponse.json(updatedQuestionSet, { status: 200 });

  } catch (error) {
    console.error("Error updating question set:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
