import prisma from "@/lib/prismadb";

// Define types
enum GradeOption {
  GR3 = 'GR3',
  GR7 = 'GR7'
}

enum TypeOption {
  Islamic = 'Islamic',
  Quran = 'Quran'
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
  completed: boolean;
  startTime: string;
    endTime: string;
}

export default async function getIslamicSet(grade: GradeOption): Promise<QuestionSet | null> {
  try {
    // Fetch the first Islamic question set for the specified grade with completed = false
    const questionSet = await prisma.questionSet.findFirst({
      where: {
        grade: grade,
        type: 'Islamic',
        completed: false, // Ensure the question set is not completed
      },
      
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        grade: true,
        type: true,
        completed: true,
        startTime: true,
        endTime: true,
        questions: {
          orderBy: { id: 'asc' } ,
          select: {
            id: true,
            question: true,
            option1: true,
            option2: true,
            option3: true,
            option4: true,
            answer: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      },
    });

    // Return null if no question set is found
    if (!questionSet) {
      return null;
    }

    // Map and return the result
    return {
      id: questionSet.id,
      title: questionSet.title,
      createdAt: questionSet.createdAt.toString(),
      updatedAt: questionSet.updatedAt.toString(),
      grade: questionSet.grade as GradeOption,
      type: questionSet.type as TypeOption,
      completed: questionSet.completed,
      startTime: questionSet.startTime.toISOString(),
      endTime: questionSet.endTime.toISOString(),
      questions: questionSet.questions.map(question => ({
        id: question.id,
        question: question.question,
        option1: question.option1,
        option2: question.option2,
        option3: question.option3,
        option4: question.option4,
        answer: question.answer,
        createdAt: question.createdAt.toString(),
        updatedAt: question.updatedAt.toString(),
      })),
    };

  } catch (error) {
    console.error("Error fetching Islamic set:", error);
    return null;
  }
}
