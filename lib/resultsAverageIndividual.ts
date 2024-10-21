'use server';

import prisma from "@/lib/prismadb";
import { SchoolOption } from "@prisma/client";



export async function resultAverageIndividual(questionSetId: number, school: SchoolOption) {
    try {
        // Fetch the result for the specific questionSetId and school
        const result = await prisma.result.findFirst({
            where: {
                questionSetId: questionSetId,
                school: school,
            },
        });

        // Return the found result, or null if not found
        return result || { message: 'No result found for the given question set and school.' };

    } catch (error) {
        console.error('Error:', error);
        return { errors: { general: "An error occurred while fetching the result average." } };
    }
}
