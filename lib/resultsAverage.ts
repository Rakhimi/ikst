'use server';

import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";

enum SchoolOption {
    ALSTX = 'ALSTX',
    WDLTX = 'WDLTX',
    BILTX = 'BILTX',
    MCAMI = 'MCAMI',
    MABIL = 'MABIL'
}

export async function resultAverage() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return { errors: { general: "User not authenticated" } };
        }

        // Get all QuestionSets
        const questionSets = await prisma.questionSet.findMany();

        // Ensure that QuestionSets exist before proceeding
        if (!questionSets.length) {
            return { errors: { general: "No QuestionSets found for this user" } };
        }

        // Process each QuestionSet
        const result = await Promise.all(questionSets.map(async (questionSet) => {
            try {
                // Check if results already exist for this QuestionSet
                const existingResults = await prisma.result.findMany({
                    where: {
                        questionSetId: questionSet.id,
                    },
                });

                if (existingResults.length > 0) {
                    console.log(`Results already exist for QuestionSet ID: ${questionSet.id}. Skipping recalculation.`);
                    return { success: true, questionSetId: questionSet.id, message: "Already calculated" };
                }

                console.log(`Processing QuestionSet ID: ${questionSet.id}`);  // Debugging

                // Fetch all AnswerSets for this QuestionSet
                const answerSets = await prisma.answerSet.findMany({
                    where: {
                        questionSetId: questionSet.id,
                    },
                    include: {
                        profile: true,  // Assuming profile includes school info
                    },
                });

                // Group AnswerSets by school and calculate the average result for each school
                const schoolResults: { [school: string]: number[] } = {};

                answerSets.forEach((answerSet) => {
                    const school = answerSet.profile.school as keyof typeof SchoolOption;  // Cast to SchoolOption
                    if (!schoolResults[school]) {
                        schoolResults[school] = [];
                    }
                    if (answerSet.result !== null) {
                        schoolResults[school].push(answerSet.result);
                    }
                });

                // Calculate average result for each school
                const schoolAverages = Object.keys(schoolResults).map(school => {
                    // Ensure the school is a valid enum value
                    if (!(school in SchoolOption)) {
                        throw new Error(`Invalid school value: ${school}`);
                    }

                    return {
                        school: school as SchoolOption,
                        averageScore: schoolResults[school].reduce((a, b) => a + b, 0) / schoolResults[school].length,
                    };
                });

                console.log(`Calculated school averages for QuestionSet ID ${questionSet.id}:`, schoolAverages);  // Debugging

                // Calculate overall average result across all schools
                const totalScores = answerSets.map(answerSet => answerSet.result).filter(result => result !== null);
                const overallAverage = totalScores.length ? totalScores.reduce((a, b) => a + b, 0) / totalScores.length : 0;

                console.log(`Overall average score for QuestionSet ID ${questionSet.id}: ${overallAverage}`);  // Debugging

                // Create new results for each school
                await Promise.all(schoolAverages.map(async (schoolAverage) => {
                    try {
                        // Create a new result entry for the school average
                        await prisma.result.create({
                            data: {
                                questionSetId: questionSet.id,
                                school: schoolAverage.school,
                                score: schoolAverage.averageScore,  // Set the school average score
                                allSchool: overallAverage,  // Set the all-school average score
                            },
                        });

                        console.log(`Created result for school ${schoolAverage.school} in QuestionSet ID ${questionSet.id}`);
                    } catch (err) {
                        console.error(`Error creating result for school ${schoolAverage.school}:`, err);
                        throw err;  // Ensure failure is handled
                    }
                }));

                return { success: true, questionSetId: questionSet.id };

            } catch (error) {
                console.error(`Error processing QuestionSet ID ${questionSet.id}:`, error);
                return { success: false, questionSetId: questionSet.id, error: 'error'};
            }
        }));

        return { result };

    } catch (error) {
        console.error('Error:', error);
        return { errors: { general: "An error occurred while calculating and storing the averages" } };
    }
}
