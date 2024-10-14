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
    startTime: string; // Time as a string, e.g. "09:00"
    endTime: string;   // Time as a string, e.g. "12:00"
    date: string;      // Date as a string, e.g. "2024-10-11"
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { questions, title, grade, type, startTime, endTime }: FormValues = body;

        // Get the current user (assuming this function gets user data from the session)
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        // Check if a QuestionSet of the same grade and type already exists with `completed` as false
        const existingQuestionSet = await prisma.questionSet.findFirst({
            where: {
                grade: grade,
                type: type,
                completed: false,
            },
        });

        if (existingQuestionSet) {
            return NextResponse.json(
                { error: `A ${grade} ${type} question set already exists` },
                { status: 400 }
            );
        }

        // Combine date and time to create DateTime values in ISO format
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        // Proceed to create a new QuestionSet since no incomplete set exists
        const questionSet = await prisma.questionSet.create({
            data: {
                title: title,
                grade: grade,
                type: type,
                startTime: startDate,
                endTime: endDate,
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

        return NextResponse.json(questionSet, { status: 201 });

    } catch (error) {
        console.error("Error creating question set:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
