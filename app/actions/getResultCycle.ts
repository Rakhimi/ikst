import prisma from "@/lib/prismadb";
import { SchoolOption, GradeOption } from "@prisma/client";

interface Profile {
    id: number;
    userId: number;
    firstName: string;
    lastName: string;
    code: string;
    school: SchoolOption // Replace `$Enums.SchoolOption` with the actual enum or type
    grade: GradeOption  // Replace `$Enums.GradeOption` with the actual enum or type
}

interface Result {
    profile: Profile;
    islamicResult: number | null;
    quranResult: number | null;
}

export async function getResultCycle(cycleId: number) {
    try {
        // Fetch the cycle with related QuestionSets
        const cycle = await prisma.cycle.findUnique({
            where: { id: cycleId },
            include: {
                islamicSet: true, // Fetch the related Islamic QuestionSet
                quranSet: true,   // Fetch the related Quran QuestionSet
            },
        });

        if (!cycle) {
            throw new Error("Cycle not found");
        }

        // Fetch profiles and results associated with both QuestionSets
        const islamicResults = await prisma.answerSet.findMany({
            where: {
                questionSetId: cycle.islamicSet?.id,
            },
            include: {
                profile: true, // Include the profile information
            },
        });

        const quranResults = await prisma.answerSet.findMany({
            where: {
                questionSetId: cycle.quranSet?.id,
            },
            include: {
                profile: true, // Include the profile information
            },
        });

        // Combine results for Islamic and Quran sets
        const combinedResults = [...islamicResults, ...quranResults];

        // Group by profile and summarize results
        const resultsByProfile = combinedResults.reduce((acc, result) => {
            const profileId = result.profileId;
            if (!acc[profileId]) {
                acc[profileId] = {
                    profile: result.profile as Profile, // Cast to the Profile type
                    islamicResult: null,
                    quranResult: null,
                };
            }

            if (result.questionSetId === cycle.islamicSet?.id) {
                acc[profileId].islamicResult = result.result;
            } else if (result.questionSetId === cycle.quranSet?.id) {
                acc[profileId].quranResult = result.result;
            }

            return acc;
        }, {} as Record<number, Result>);

        // Convert the result object to an array
        const resultList = Object.values(resultsByProfile);

        // Group results by school
        const groupedBySchool = resultList.reduce((acc, result) => {
            const school = result.profile.school || "Unknown School"; // Use a fallback for profiles without a school
            if (!acc[school]) {
                acc[school] = [];
            }
            acc[school].push(result);
            return acc;
        }, {} as Record<string, Result[]>);

        return groupedBySchool; // Return results grouped by school
    } catch (error) {
        console.error("Error fetching cycle results:", error);
        throw new Error("Failed to fetch cycle results");
    }
}
