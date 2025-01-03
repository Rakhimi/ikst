import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

// Define types
enum GradeOption {
  GR3 = 'GR3',
  GR7 = 'GR7'
}

enum TypeOption {
  Islamic = 'Islamic',
  Quran = 'Quran'
}

enum AnswerOption {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

interface Question {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: AnswerOption;
  createdAt: string;
  updatedAt: string;
  isAdded: boolean;
}

interface QuestionSet {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
  grade: GradeOption;
  type: TypeOption;
  startTime: string; // We'll store it as a string, then combine date & time
  endTime: string;
}

export default async function getQuestions(questionSetId?: number): Promise<QuestionSet | null> {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return null;
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
      id: questionSet.id,
      title: questionSet.title,
      createdAt: questionSet.createdAt.toString(),
      updatedAt: questionSet.updatedAt.toString(),
      grade: questionSet.grade as GradeOption,
      type: questionSet.type as TypeOption,
      startTime: questionSet.startTime.toISOString(),
      endTime: questionSet.endTime.toISOString(),
      questions: questionSet.questions.map(question => ({
        id: question.id,
        question: question.question,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        answer: question.answer as AnswerOption,
        isAdded: false,
        createdAt: question.createdAt.toString(),
        updatedAt: question.updatedAt.toString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching question set:", error);
    return null;
  }
}
