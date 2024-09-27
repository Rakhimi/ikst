'use client'

import React from 'react';
import { useRouter } from 'next/navigation';

// Define the types based on your data structure
interface QuestionSet {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface QuestionsReviewProps {
  questionSets: QuestionSet[] | QuestionSet | null;
}

// Helper function to format date consistently
const formatDate = (dateString: string) => {
  // Use a consistent date format, e.g., 'en-US' for American format
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

const QuestionSet: React.FC<QuestionsReviewProps> = ({ questionSets }) => {

  const router = useRouter();

  if (questionSets === null) {
    return <div className='mt-20 text-2xl font-semibold'>No question sets available</div>;
  }

  if (Array.isArray(questionSets)) {
    if (questionSets.length === 0) {
      return <div className='text-2xl font-semibold'>This is an error</div>;
    }

    return (
      <div className='flex flex-col gap-4 my-10'>
        <h1 className='text-2xl font-bold'>Question Sets</h1>
        {questionSets.map((set) => (
          <div key={set.id} className="question-set p-2 bg-gray-100 border rounded-md w-1/3 hover:bg-gray-200 cursor-pointer"
          onClick={()=>{router.push(`/questionsReview/${set.id}`)}}
          >
            <h2 className='font-semibold text-xl mb-5'>{set.title}</h2>
            <p className='font-semibold text-gray-700'>Created at: {formatDate(set.createdAt)}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="question-set">
        <h1>{questionSets.title}</h1>
        <p>Created at: {formatDate(questionSets.createdAt)}</p>
      </div>
    </div>
  );
};

export default QuestionSet;
