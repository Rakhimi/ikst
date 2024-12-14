'use client';

import React, { useRef } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { TypeOption } from '@prisma/client';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Define interfaces for the expected structure
interface Profile {
    id: number;
    firstName: string;
    lastName: string;
    school: string;
    grade: string;
}

interface AnswerSet {
    questionSetId: number;
    questionSetTitle: string;
    type: TypeOption;
    result: number | null;
}

interface Average {
    questionSetTitle: string;
    type: TypeOption;
    schoolAverage: number | null;
    allSchoolAverage: number | null;
}

interface ProfileResultProps {
    profile: Profile;
    results: AnswerSet[];
    averages: Average[];
}

const ProfileResult: React.FC<ProfileResultProps> = ({ profile, results, averages }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const generatePDF = async () => {
        const element = componentRef.current;
        if (!element) return;

        const canvas = await html2canvas(element);
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('profile-result.pdf');
    };

    return (
        <div className="mt-10">
            <button
                onClick={generatePDF}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
            >
                Download PDF
            </button>
            <div ref={componentRef}>
                <Card>
                    <CardHeader className="text-xl">
                        <CardTitle className="mb-2 text-2xl">Grade Report IKST</CardTitle>
                        <CardTitle>{profile.firstName} {profile.lastName}</CardTitle>
                        <CardTitle>{profile.grade}</CardTitle>
                        <CardTitle>{profile.school}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-16">
                            {results.map((answerSet) => {
                                const matchedAverage = averages.find(avg => avg.questionSetTitle === answerSet.questionSetTitle);

                                return (
                                    <div key={answerSet.questionSetId} className="flex gap-4">
                                        <div className="flex gap-16 text-lg font-semibold">
                                            <div>{answerSet.type}</div>
                                            <div>Your result: {answerSet.result ?? 'N/A'}%</div>
                                            <div>School average: {matchedAverage?.schoolAverage ?? 'N/A'}%</div>
                                            <div>All schools average: {matchedAverage?.allSchoolAverage ?? 'N/A'}%</div>
                                        </div>

                                        <div className="relative w-full h-10 bg-gray-300">
                                            <div className="h-full bg-gradient-to-r from-red-500 to-green-500" style={{ width: '100%' }}></div>
                                            <div className="absolute inset-0 h-full pointer-events-none">
                                                {[
                                                    { value: matchedAverage?.schoolAverage, color: 'bg-red-700', labelColor: 'text-red-700' },
                                                    { value: matchedAverage?.allSchoolAverage, color: 'bg-sky-700', labelColor: 'text-sky-700' },
                                                    { value: answerSet.result, color: 'bg-black', labelColor: 'text-black' },
                                                ].map((marker, index) =>
                                                    marker.value !== null ? (
                                                        <div
                                                            key={index}
                                                            className="absolute bottom-0"
                                                            style={{ left: `${marker.value}%`, transform: 'translateX(-50%)' }}
                                                        >
                                                            <div className={`text-md font-semibold text-center ${marker.labelColor}`}>
                                                                {marker.value}%
                                                            </div>
                                                            <div className={`w-1.5 h-12 ${marker.color}`}></div>
                                                        </div>
                                                    ) : null
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                    <CardFooter>
                        <p className="text-lg font-semibold">
                            Blue line: All schools average. Red line: School average.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default ProfileResult;
