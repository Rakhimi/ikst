'use client';

import React, { useEffect, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { resultAverageIndividual } from '@/lib/resultsAverageIndividual';
import { SchoolOption } from '@prisma/client';




export interface AnswerSet {
    id: number;
    createdAt: Date;
    profileId: number;
    questionSetId: number;
    result: number | null;
    questionSet: QuestionSet;
}

export interface Result {
    id: number;
    score: number;
    questionSetId: number;
    school: SchoolOption;
    allSchool: number;
}

export interface QuestionSet {
    id: number;
    title: string;
    createdAt: Date;
    updatedAt: Date;
    startTime: Date;
    endTime: Date;
    grade: 'GR3' | 'GR7';
    type: 'Islamic' | 'Quran';
    completed: boolean;
    results: Result[];
}

export interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    school: SchoolOption
    grade: 'GR3' | 'GR7';
    code: string;
    userId: number;
    answerSets: AnswerSet[];
}

export interface ProfileResultProps {
    profile: Profile;
}

const ProfileResult: React.FC<ProfileResultProps> = ({ profile }) => {
    const [schoolAverages, setSchoolAverages] = useState<{ [key: number]: number | null }>({});
    const [allSchoolAverage, setAllSchoolAverage] = useState<{ [key: number]: number | null }>({});

    useEffect(() => {
      // Fetch average results for each answerSet
      const fetchAverages = async () => {
          const averages: { [key: number]: number | null } = {};
          const allAverages: { [key: number]: number | null } = {};
          for (const answerSet of profile.answerSets) {
              const result = await resultAverageIndividual(answerSet.questionSetId, profile.school);
              
              // Check if the result is valid and contains a score
              if ("score" in result) {
                  averages[answerSet.id] = result.score;
                  allAverages[answerSet.id] = result.allSchool;
              } else {
                  console.error(result.errors?.general || "Error fetching average result");
                  averages[answerSet.id] = null; // Default to null if there was an error
              }
          }
          setSchoolAverages(averages);
          setAllSchoolAverage(allAverages)
      };

      fetchAverages();
  }, [profile.answerSets, profile.school]);

    return (
        <div className='mt-10'>
            <Card>
                <CardHeader className='text-xl'>
                    <CardTitle className='mb-2 text-2xl'>Grade Report IKST</CardTitle>
                    <CardTitle>{profile.firstName} {profile.lastName}</CardTitle>
                    <CardTitle>{profile.grade}</CardTitle>
                    <CardTitle>{profile.school}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className='flex flex-col gap-16'>
                        {profile.answerSets.map((answerSet) => (
                            <div key={answerSet.id} className='flex justify-between'>
                                <div className='flex gap-16 text-xl font-semibold'>
                                    <div>
                                        {answerSet.questionSet.type}
                                    </div>
                                    <div>
                                        Your result: {answerSet.result ?? 'N/A'}%
                                    </div>
                                    <div>
                                        School average: {schoolAverages[answerSet.id] ?? 'Loading...'}%
                                    </div>
                                </div>

                                <div className="relative w-1/2 h-10 bg-gray-300">
                                    <div
                                        className="h-full bg-gradient-to-r from-red-500 to-green-500"
                                        style={{ width: '100%' }}
                                    ></div>
                                    <div className="absolute inset-0 h-full pointer-events-none">
                                        {[
                                            { value: schoolAverages[answerSet.id], color: 'bg-red-700', labelColor: 'text-red-700' },
                                            { value: allSchoolAverage[answerSet.id], color: 'bg-sky-700', labelColor: 'text-sky-700' },
                                            { value: answerSet.result, color: 'bg-black', labelColor: 'text-black' },
                                        ].map((marker) => (
                                            <div
                                                key={marker.value}
                                                className="absolute bottom-px"
                                                style={{ left: `${marker.value}%`, transform: 'translateX(-50%)' }}
                                            >
                                                <div className={`text-md font-semibold text-center ${marker.labelColor}`}>
                                                    {marker.value}%
                                                </div>
                                                <div className={`w-1.5 h-12 ${marker.color}`}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <p className='text-lg font-semibold'>Blue line is school average. Red line is average of all schools</p>
                </CardFooter>
            </Card>
        </div>
    );
}

export default ProfileResult;
