'use server';

import prisma from "@/lib/prismadb";
import getIslamicSet from "@/app/actions/getIslamicSet";

interface VerifyCode {
    userId?: number; 
    errors?: { [key: string]: string };  // Error messages for each field
}

enum GradeOption {
    GR3 = 'GR3',
    GR7 = 'GR7'
}

enum SchoolOption {
    ALSTX = 'ALSTX',
    WDLTX = 'WDLTX',
    BILTX = 'BILTX',
    MCAMI = 'MCAMI',
    MABIL = 'MABIL'
  }

export async function verifyCode(firstName: string, lastName: string, school: SchoolOption, grade: GradeOption, profileId: string): Promise<VerifyCode> {
    try {
        // Fetch the user's stored secret answers based on the email
        const user = await prisma.profile.findUnique({
            where: {
                firstName: firstName,
                lastName: lastName,
                school: school,
                grade: grade,
                code: profileId,
            },
        });

        if (!user) {
            return { errors: { email: "Wrong credentials data" } };
        }

        // Fetch the Islamic question set for the grade
        const questionSet = await getIslamicSet(grade);

        if (!questionSet) {
            return { errors: { test: "No test available for this grade" } };
        }

        // Get the current time
        const currentTime = new Date();

        // Convert the questionSet's startTime and endTime to Date objects
        const startTime = new Date(questionSet.startTime);
        const endTime = new Date(questionSet.endTime);

        // Check if the current time is within the test window
        if (currentTime < startTime) {
            return { errors: { time: "The test has not started yet." } };
        }

        if (currentTime > endTime) {
            return { errors: { time: "The test is no longer available." } };
        }

        return { userId: user.id };

    } catch (error) {
        console.error('Error verifying code:', error);
        return { errors: { general: "An error occurred during verification." } }; // General error
    }
}
