import prisma from "@/lib/prismadb";

// Define types
enum GradeOption {
  GR3 = "GR3",
  GR7 = "GR7",
}

enum TypeOption {
  Islamic = "Islamic",
  Quran = "Quran",
}

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
  grade: GradeOption;
  type: TypeOption;
  startTime: string;
  endTime: string;
}

export default async function getQuestionSet(completed: boolean): Promise<QuestionSet[] | null> {
  try {
    // Fetch question sets based on the completed status
    const questionSets = await prisma.questionSet.findMany({
      where: {
        completed, // Dynamically filter by the completed status
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        grade: true,
        type: true,
        startTime: true,
        endTime: true,
      },
    });

    return questionSets.map((set) => ({
      ...set,
      createdAt: set.createdAt.toString(),
      updatedAt: set.updatedAt.toString(),
      startTime: set.startTime.toISOString(),
      endTime: set.endTime.toISOString(),
      questions: [], // Placeholder for questions
      grade: set.grade as GradeOption,
      type: set.type as TypeOption,
    }));
  } catch (error) {
    console.error("Error fetching question sets:", error);
    return null;
  }
}
