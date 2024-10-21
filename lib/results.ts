'use server';

import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

export async function resultList() {
    try {
        const currentUser = await getCurrentUser();
    
        if (!currentUser) {
            return;
        }

        // Fetch all profiles along with their AnswerSets (without returning the full QuestionSet object)
        const profiles = await prisma.profile.findMany({
            include: {
                answerSets: {
                    select: {
                        id: true,
                        createdAt: true, // Date field (createdAt)
                        result: true,    // Include result
                        questionSet: {   // Only selecting grade and type from questionSet
                            select: {
                                grade: true,
                                type: true,
                            }
                        }
                    },
                },
            },
        });

        // Map through the profiles and format the createdAt to return only the date part
        const formattedProfiles = profiles.map(profile => ({
            ...profile,
            answerSets: profile.answerSets.map(answerSet => ({
                id: answerSet.id,
                result: answerSet.result,  // Include result
                date: answerSet.createdAt.toISOString().split('T')[0], // Extract only the date (YYYY-MM-DD)
                grade: answerSet.questionSet.grade,  // Extract and include grade
                type: answerSet.questionSet.type,    // Extract and include type
            })),
        }));

        return formattedProfiles;

    } catch (error) {
        console.error('Error:', error);
        return { errors: { general: "An error occurred" } }; // General error
    }
}
