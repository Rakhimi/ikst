'use server';

import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function testCompleted() {
    try {
        const currentUser = await getCurrentUser();
    
        if (!currentUser) {
            return;
        }

        // Get the current time
        const currentTime = new Date();

        // Update all QuestionSets where endTime has passed to set completed = true
        const updatedQuestionSets = await prisma.questionSet.updateMany({
            where: {
                endTime: {
                    lt: currentTime, // endTime is less than current time
                },
                completed: false, // Only update those not already marked as completed
            },
            data: {
                completed: true, // Set completed to true
            },
        });

        // Optionally, return some information about the updated question sets
        return {
            message: `${updatedQuestionSets.count} question sets were updated to completed.`,
        };

    } catch (error) {
        console.error('Error:', error);
        return { errors: { general: "An error occurred" } }; // General error
    }
}
