import prisma from "@/lib/prismadb";
import getCurrentUser from "./getCurrentUser";

export default async function getSchedule(questionSetId: number) {
  try {
    // Fetch current user
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return [];
    }

    // Fetch the schedule related to the specific QuestionSet ID
    const schedule = await prisma.schedule.findFirst({
      where: {
        questionSetId: questionSetId,
        questionSet: {
          userId: currentUser.id, // Only allow fetching schedules owned by the current user
        }
      }
    });

    if (!schedule) {
      return [];
    }

    // Safely return the schedule
    const safeSchedule = {
      id: schedule.id,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      createdAt: schedule.createdAt,
      updatedAt: schedule.updatedAt,
    };

    return safeSchedule;
  } catch (error) {
    console.error('Error fetching schedule:', error);
    // Return an empty array in case of any error
    return [];
  }
}
