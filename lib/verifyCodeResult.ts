'use server';

import prisma from "@/lib/prismadb";

interface VerifyResult {
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

export async function verifyCodeResult(firstName: string, lastName: string, school: SchoolOption, grade: GradeOption, profileId: string): Promise<VerifyResult> {
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
            return { errors: { email: "Email not found" } };
        }

        return { userId: user.id };

    } catch (error) {
        console.error('Error verifying code:', error);
        return { errors: { general: "An error occurred during verification." } }; // General error
    }
}
