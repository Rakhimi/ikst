'use client'

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import axios from "axios";
import { testCompleted } from '@/lib/testCompleted';
import { cycle } from '@/lib/cycle';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Define the types based on your data structure

enum GradeOption {
  GR3='GR3',
  GR7='GR7'
}

enum TypeOption {
  Islamic='Islamic',
  Quran='Quran'
}

interface QuestionSet {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  grade: GradeOption;
  type: TypeOption;
  startTime: string;
    endTime: string;
}

interface QuestionsReviewProps {
  questionSets: QuestionSet[] | null;
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

  useEffect(() => {
    const checkTestCompletion = async () => {
      try {
        await testCompleted();
        await cycle();
        console.log('Test completion status checked');
      } catch (error) {
        console.error('Error checking test completion:', error);
      }
    };

    checkTestCompletion();
  }, []);


  const deleteQuestionSet = async (id: number) => {
    try {
      const response = await axios.delete(`/api/delete-questions/${id}`);

      console.log('Response:', response.data);

      if (response.status === 200) {
        const result = response.data;

        if (result.success) {
          // Update the profiles list after successful deletion
          toast.success('Question set deleted');
          router.refresh();
        } else {
          toast.error('Failed to delete');
          console.error(result.error || 'Failed to delete the question set');
        }
      } else {
        toast.error('Failed to delete the question set');
      }
    } catch (error) {
      console.error('An error occurred while deleting the question set', error);
    }
  };
  if (questionSets === null) {
    return <div className='mt-20 text-2xl font-semibold'>No question sets available</div>;
  }

  if (Array.isArray(questionSets)) {
    if (questionSets.length === 0) {
      return <div className='text-2xl font-semibold'>No question sets available</div>;
    }

    return (
      <div className="flex flex-col gap-4 my-10">
        <h1 className="text-2xl font-bold">Question Sets</h1>
        {questionSets.map((set) => (
          <div className="flex gap-2" key={set.id}>
            {/* Question Set Info */}
            <div
              className="question-set p-2 bg-gray-100 border rounded-md w-1/3 hover:bg-gray-200 cursor-pointer"
              onClick={() => {
                router.push(`/questionsReview/${set.id}/${false}`);
              }}
            >
              <h2 className="font-semibold text-xl">{set.title}</h2>
              <h3 className="font-semibold text-xl">{set.grade}</h3>
              <p className="font-semibold text-xl">{set.type}</p>
              <p className="font-semibold text-gray-700">
                Start Time: {formatDate(set.startTime)}
              </p>
              <p className="font-semibold text-gray-700">
                End Time: {formatDate(set.endTime)}
              </p>
            </div>
    
            <div className="flex flex-col gap-4">
              <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="bg-red-500 text-white font-semibold hover:bg-red-600">
                  Delete
              </Button>
            </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your registration
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => deleteQuestionSet(set.id)}>Continue</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>  
            </div>
          </div>
        ))}
      </div>
    );
    
  }

};

export default QuestionSet;
