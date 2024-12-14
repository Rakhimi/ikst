import prisma from "@/lib/prismadb";

export async function getIndividualResult2(profileId: number) {
    try {
        // Fetch the profile and include their answer sets and question sets
        const profile = await prisma.profile.findUnique({
            where: { id: profileId },
            include: {
                answerSets: {
                    include: {
                        questionSet: true, // Include the related QuestionSet for context
                    },
                },
            },
        });

        if (!profile) {
            throw new Error("Profile not found");
        }

        // Extract grade and school for filtering
        const { grade, school, answerSets } = profile;

        // Process results for the profile
        const results = answerSets.map((answerSet) => ({
            questionSetId: answerSet.questionSet.id,
            questionSetTitle: answerSet.questionSet.title,
            type: answerSet.questionSet.type, // Assuming `type` exists in `QuestionSet`
            result: answerSet.result,
        }));

        // Fetch averages scoped by QuestionSet, Grade, and Type
        const averages = await Promise.all(
            results.map(async (result) => {
                const { questionSetId, type } = result;

                // School Average
                const schoolAverageResult = await prisma.answerSet.aggregate({
                    _avg: {
                        result: true,
                    },
                    where: {
                        questionSetId, // Same QuestionSet
                        profile: {
                            grade, // Same Grade
                            school, // Same School
                        },
                    },
                });

                // All-School Average
                const allSchoolAverageResult = await prisma.answerSet.aggregate({
                    _avg: {
                        result: true,
                    },
                    where: {
                        questionSetId, // Same QuestionSet
                        profile: {
                            grade, // Same Grade
                        },
                    },
                });

                return {
                    questionSetTitle: result.questionSetTitle,
                    type,
                    schoolAverage: schoolAverageResult._avg.result
                        ? Math.round(schoolAverageResult._avg.result)
                        : null,
                    allSchoolAverage: allSchoolAverageResult._avg.result
                        ? Math.round(allSchoolAverageResult._avg.result)
                        : null,
                };
            })
        );

        return {
            profile: {
                id: profile.id,
                firstName: profile.firstName,
                lastName: profile.lastName,
                school,
                grade,
            },
            results,
            averages,
        };
    } catch (error) {
        console.error("Error fetching profile with results and scoped averages:", error);
        throw new Error("Failed to fetch profile with results and scoped averages");
    }
}