'use server';

import prisma from "@/lib/prismadb";

interface VerifyResult {
    userId?: number; 
    errors?: { [key: string]: string };  // Error messages for each field
}

export async function verifyCode(firstName: string, lastName: string, school: string, grade: string, profileId: string): Promise<VerifyResult> {
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

        // If no user is found, return an error indicating user not found
        if (!user) {
            return { errors: { email: "Email not found" } };
        }

        return { userId : user.id }; 

    } catch (error) {
        console.error('Error verifying secret:', error);
        return { errors: { general: "An error occurred during verification" } }; // General error
    }
}
