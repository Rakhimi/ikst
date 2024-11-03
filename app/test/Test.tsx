'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

import { useCountdownTimer } from '@/components/hooks/useTimer';

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

enum AnswerOption {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

enum GradeOption {
  GR3 = 'GR3',
  GR7 = 'GR7'
}

enum TypeOption {
  Islamic = 'Islamic',
  Quran = 'Quran'
}

interface Question {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  option4: string;
  answer: string; // We won't show this
  createdAt: string;
  updatedAt: string;
}

interface QuestionSet {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
  grade: GradeOption;
  type: TypeOption;
  completed: boolean;
}

interface TestProps {
  questionSet: QuestionSet | null;
  profileId: number;
}

interface Answer {
  [key: string]: AnswerOption | ''; // Store answers by question ID
}






const Test: React.FC<TestProps> = ({ questionSet, profileId }) => {
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const { control, watch } = useForm<Answer>();
  const router = useRouter();

  const { formattedTime, seconds } = useCountdownTimer(300, handleTimeUp);

  const watchAnswers = watch();

  useEffect(() => {
    setAnsweredCount(Object.values(watchAnswers).filter(Boolean).length);
  }, [watchAnswers]);


  if (questionSet === null) {
    return <div className="mt-20 text-2xl font-semibold">No question sets available</div>;
  }

  if (Array.isArray(questionSet)) {
    if (questionSet.length === 0) {
      return <div className='text-2xl font-semibold'>No questions available in this set</div>;
    }
    return <div className='text-2xl font-semibold'>Invalid question set</div>;
  }

  const testing = ()=> {
    onSubmit(watchAnswers);
    router.push(`/waitingRoom/${seconds}/${questionSet.grade}/${profileId}`);
  }


  function handleTimeUp() {
    if (!questionSet) {
      toast.error('Question set is not available');
      return;
    }
    onSubmit(watchAnswers);
    router.push(`/quranTest/${questionSet.grade}/${profileId}`);
  }

  // Submit function
  // Updated submit function
  const onSubmit: SubmitHandler<Answer> = async () => {
    try {
      const answers = Object.entries(watchAnswers).map(([key, value]) => ({
        questionId: key.split('-')[1], // Extract question ID from the key
        answer: value
      }));

      // Calculate the score
      let correctCount = 0;
      questionSet.questions.forEach((question) => {
        const userAnswer = watchAnswers[`question-${question.id}`];
        if (userAnswer === question.answer) {
          correctCount += 1;
        }
      });

      const totalQuestions = questionSet.questions.length;
      const score = (correctCount/totalQuestions) * 100

      // Send the answers and the score to the API
      const response = await fetch('/api/submit-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileId: Number(profileId),
          questionSetId: questionSet.id,
          answers: answers,
          score: score, // Include the score in the payload
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit answers');
      }

      toast.success('Submitted successfully');

    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Failed to submit answers');
    }
  };


  return (
    <div>
      <div className="fixed top-40 left-10 bg-white z-50 p-4">
        <h1 className="text-2xl font-bold mb-4">Your time</h1>
        <h1 className="text-3xl font-bold mb-4">{formattedTime}</h1>
        
      </div>
    <div className='flex flex-col justify-center items-center my-20'>
      <h1 className="text-2xl font-bold mb-4">{questionSet.title}</h1>

      <form className='w-1/2'>
        {questionSet.questions.map((question, index) => (
          <div key={question.id} className="mt-6 p-4 flex flex-col gap-4 border-2 border-gray-300 rounded-md">
            <p className="font-semibold">
              {index + 1}. {question.question}
            </p>

            <Controller
              control={control}
              name={`question-${question.id}`}
              defaultValue=""
              render={({ field }) => (
                <RadioGroup value={field.value} onValueChange={field.onChange}>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`A-${question.id}`}>
                      A. {question.option1}
                    </label>
                    <RadioGroupItem value="A" id={`A-${question.id}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`B-${question.id}`}>
                      B. {question.option2}
                    </label>
                    <RadioGroupItem value="B" id={`B-${question.id}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`C-${question.id}`}>
                      C. {question.option3}
                    </label>
                    <RadioGroupItem value="C" id={`C-${question.id}`} />
                  </div>
                  <div className="flex items-center justify-between">
                    <label htmlFor={`D-${question.id}`}>
                      D. {question.option4}
                    </label>
                    <RadioGroupItem value="D" id={`D-${question.id}`} />
                  </div>
                </RadioGroup>
              )}
            />
          </div>
        ))}

        <div className='flex flex-col gap-4 mb-5 p-2'>
          <div className="mt-8">
            <h2 className="text-lg font-bold mb-2">Current Answers:</h2>
            <div className='flex gap-4 font-semibold'>
              {Object.entries(watchAnswers).map(([key, value], index) => (
                <p key={key}>{index + 1}: {value}</p>
              ))}
            </div>
          </div>

          <p className='text-xl font-semibold'>Answered: {answeredCount}/{questionSet.questions.length}</p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="mt-4 px-4 py-2 bg-sky-600 text-white rounded">
              Submit
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                Make sure to check everything
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
              onClick={testing}>
                Submit
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </div>
    </div>
  );
};

export default Test;
