'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface Schedule {
  id: number;
  startTime: string;
  endTime: string | null;
  createdAt: string;
  updatedAt: string;
}

interface QuestionSet {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  schedule: Schedule | null;
}

interface QuestionsReviewProps {
  questionSets: QuestionSet[] | null;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });
};

const TestList: React.FC<QuestionsReviewProps> = ({ questionSets }) => {
  const router = useRouter();

  // If no question sets, show message
  if (questionSets === null) {
    return <div className="mt-20 text-2xl font-semibold">No question sets available</div>;
  }

  // Filter question sets that have a schedule
  const questionSetsWithSchedule = questionSets.filter((set) => set.schedule);

  // If no question sets with schedule, show different message
  if (questionSetsWithSchedule.length === 0) {
    return <div className="mt-20 text-2xl font-semibold">No scheduled question sets available</div>;
  }

  return (
    <div className="w-1/3 flex flex-col gap-6 mt-10">
      {questionSetsWithSchedule.map((set) => (
        <Card key={set.id}>
          <CardHeader>
            <CardTitle>{set.title}</CardTitle>
            <CardDescription className='text-md'>You can only take this test at the specified time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="schedule-info bg-green-100 p-2 rounded-md">
              <h3 className="font-semibold text-lg">Scheduled:</h3>
              <p>Start: {formatDate(set.schedule!.startTime)}</p>
              {set.schedule!.endTime && <p>End: {formatDate(set.schedule!.endTime)}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={() => router.push(`/test/${set.id}`)}>Take test</Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default TestList;
