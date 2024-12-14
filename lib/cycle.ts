'use server';

import prisma from "@/lib/prismadb";
import getCurrentUser from "@/app/actions/getCurrentUser";
import { GradeOption, QuestionSet } from "@prisma/client";

export async function cycle() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return;
        }

        // Fetch unpaired Islamic and Quran sets
        const unpairedIslamicSets: QuestionSet[] = await prisma.questionSet.findMany({
            where: {
                type: "Islamic",
                completed: false,
                islamicCycle: null,
            },
        });

        const unpairedQuranSets: QuestionSet[] = await prisma.questionSet.findMany({
            where: {
                type: "Quran",
                completed: false,
                quranCycle: null,
            },
        });

        // Group Islamic sets by grade
        const islamicByGrade: Record<GradeOption, QuestionSet[]> = unpairedIslamicSets.reduce((acc, set) => {
            if (!acc[set.grade]) {
                acc[set.grade] = [];
            }
            acc[set.grade].push(set);
            return acc;
        }, {} as Record<GradeOption, QuestionSet[]>);

        // Group Quran sets by grade
        const quranByGrade: Record<GradeOption, QuestionSet[]> = unpairedQuranSets.reduce((acc, set) => {
            if (!acc[set.grade]) {
                acc[set.grade] = [];
            }
            acc[set.grade].push(set);
            return acc;
        }, {} as Record<GradeOption, QuestionSet[]>);

        // Pair Islamic and Quran sets by grade
        for (const grade of Object.keys(islamicByGrade) as GradeOption[]) {
            if (
                quranByGrade[grade] &&
                islamicByGrade[grade].length > 0 &&
                quranByGrade[grade].length > 0
            ) {
                const islamicSet = islamicByGrade[grade][0]; // Get the first unpaired Islamic set for this grade
                const quranSet = quranByGrade[grade][0]; // Get the first unpaired Quran set for this grade

                // Create a cycle for the paired sets
                await prisma.cycle.create({
                    data: {
                        name: `Grade ${grade} - ${new Date().getFullYear()}`,
                        grade: grade,
                        year: new Date().getFullYear(),
                        islamicSetId: islamicSet.id,
                        quranSetId: quranSet.id,
                    },
                });

                // Remove the paired sets from their respective groups
                islamicByGrade[grade].shift();
                quranByGrade[grade].shift();
            }
        }
    } catch (error) {
        console.error('Error:', error);
        return { errors: { general: "An error occurred" } };
    }
}
