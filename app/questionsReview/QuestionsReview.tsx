'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

// Define the types based on your data structure
interface Question {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string;
  createdAt: string;
  updatedAt: string;
}

interface QuestionSet {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

interface QuestionsReviewProps {
  questionSet: QuestionSet[] | QuestionSet | null;
}

const QuestionsReview: React.FC<QuestionsReviewProps> = ({ questionSet }) => {
  const router = useRouter();

  // Handle null case
  if (questionSet === null) {
    return <div className='mt-20 text-2xl font-semibold'>No question sets available</div>;
  }

  // Handle array case
  if (Array.isArray(questionSet)) {
    if (questionSet.length === 0) {
      return <div className='text-2xl font-semibold'>No questions available in this set</div>;
    }
    // Consider rendering multiple sets if needed, but return a message for now
    return <div className='text-2xl font-semibold'>Invalid question set</div>;
  }

  // Destructure the questionSet object
  const { title, questions } = questionSet;

  // Navigate to edit mode with initial data
  const navigateToEdit = () => {
    
    const initialData = encodeURIComponent(JSON.stringify(questionSet));
    
    router.push(`/questions?initialData=${initialData}`);
  };

  return (
    <div className='my-10'>
      <div className="flex justify-between items-center mb-4">
        <h1 className='text-2xl font-bold'>{title}</h1>
        <Button onClick={navigateToEdit}>
          Edit
        </Button>
      </div>
      {questions.map((question) => (
        <div key={question.id} className="question p-4 mt-5 border rounded-md">
          <h2 className='text-xl font-semibold'>{question.question}</h2>
          <ul className='font-medium'>
            <li>Option A: {question.option1}</li>
            <li>Option B: {question.option2}</li>
            <li>Option C: {question.option3}</li>
            <li>Option D: {question.option4}</li>
          </ul>
          <p className='font-medium'>Answer: {question.answer}</p>
        </div>
      ))}
    </div>
  );
};

export default QuestionsReview;
