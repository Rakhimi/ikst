

import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";


// Define types
interface Question {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

interface QuestionSet {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

export default async function getQuestionSet(questionSetId?: number): Promise<QuestionSet | QuestionSet[] | null> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
    }

    if (!questionSetId) {
      // Retrieve all question sets without questions
      const questionSets = await prisma.questionSet.findMany({
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return questionSets.map(set => ({
        ...set,
        createdAt: set.createdAt.toString(),
        updatedAt: set.updatedAt.toString(),
        questions: [] // Add an empty array for questions
      }));
    }

    // Retrieve a specific question set with related questions
    const questionSet = await prisma.questionSet.findUnique({
      where: {
        id: questionSetId,
      },
      include: {
        questions: {
          orderBy: { id: 'asc' } 
        }
      },
    });

    if (!questionSet) {
      return null;
    }

    return {
      ...questionSet,
      createdAt: questionSet.createdAt.toString(),
      updatedAt: questionSet.updatedAt.toString(),
      questions: questionSet.questions.map(question => ({
        ...question,
        createdAt: question.createdAt.toString(),
        updatedAt: question.updatedAt.toString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching question set:", error);
    return null;
  }
}

