import { NextResponse } from "next/server";
import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

enum AnswerOption {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

interface Question {
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    isAdded: boolean;
    answer: AnswerOption;
}

interface FormValues {
    questions: Question[];
    title: string;
}

export async function POST(request: Request) {
    try {
        // Parse the incoming request body
        const body = await request.json();

        // Destructure questions from the request body
        const { questions, title }: FormValues = body;

        // Get the current user (assuming this function gets user data from the session)
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Create a new QuestionSet and associate the questions with it
        const questionSet = await prisma.questionSet.create({
            data: {
                title: title,  // You can adjust this title as needed or include it in the body
                user: { connect: { id: currentUser.id } },
                questions: {
                    create: questions.map((question) => ({
                        question: question.question,
                        option1: question.option1,
                        option2: question.option2,
                        option3: question.option3,
                        option4: question.option4,
                        answer: question.answer, 
                    })),
                },
            },
        });

        // Return the created question set as a response
        return NextResponse.json(questionSet, { status: 201 });

    } catch (error) {
        console.error("Error creating question set:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
