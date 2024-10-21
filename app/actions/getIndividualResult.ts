import prisma from "@/lib/prismadb";

export default async function getIndividualResult(profileId: number) {
  try {
    // Fetch the profile, all associated AnswerSets, and results related to those AnswerSets
    const profileData = await prisma.profile.findUnique({
      where: { id: profileId },
      include: {
        answerSets: {
          include: {
            questionSet: {
              include: {
                results: true, // Include the results of the QuestionSet
              },
            },
          },
        },
      },
    });

    if (!profileData) {
      throw new Error('Profile not found');
    }

    // Return the profile data with related AnswerSets and their results
    return profileData;
  } catch (error) {
    console.error('Error fetching result:', error);
    throw new Error('Failed to retrieve result');
  }
}
