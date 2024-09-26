'use server';

import prisma from "@/lib/prismadb";

interface VerifyResult {
    userId?: number;  // Optional user ID when verification is successful
    errors?: { [key: string]: string };  // Error messages for each field
}

export async function verifySecret(email: string, maiden: string, sport: string, color: string): Promise<VerifyResult> {
    try {
        // Fetch the user's stored secret answers based on the email
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
        });

        // If no user is found, return an error indicating user not found
        if (!user) {
            return { errors: { email: "Email not found" } };
        }

        // Normalize strings by converting to lowercase and removing spaces
        const normalize = (str: string) => str.toLowerCase().replace(/\s+/g, '');

        // Check if each secret answer is valid
        const errors: { [key: string]: string } = {};
        const isMaidenValid = normalize(maiden) === normalize(user.maiden);
        const isSportValid = normalize(sport) === normalize(user.sport);
        const isColorValid = normalize(color) === normalize(user.color);

        // Collect errors for each invalid field
        if (!isMaidenValid) errors.maiden = "Mother's maiden name is incorrect";
        if (!isSportValid) errors.sport = "Favorite sport is incorrect";
        if (!isColorValid) errors.color = "Favorite color is incorrect";

        // If there are any errors, return them
        if (Object.keys(errors).length > 0) {
            return { errors };
        }

        // If all fields are valid, return the user ID
        return { userId: user.id }; // Optional: Return user ID if needed

    } catch (error) {
        console.error('Error verifying secret:', error);
        return { errors: { general: "An error occurred during verification" } }; // General error
    }
}
