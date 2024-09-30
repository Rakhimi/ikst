'use client';

import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import toast from 'react-hot-toast';

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

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

enum AnswerOption {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
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
}

interface TestProps {
  questionSet: QuestionSet[] | QuestionSet | null;
}

interface Answer {
  [key: string]: AnswerOption | ''; // Store answers by question ID
}






const Test: React.FC<TestProps> = ({ questionSet }) => {
  const [answeredCount, setAnsweredCount] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [wrongQuestions, setWrongQuestions] = useState<number[]>([]);
  const { control, watch } = useForm<Answer>();

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
  }

  const onSubmit: SubmitHandler<Answer> = async (data) => {
    try {

      /*const response = await axios.post('/api/submit-test', {
        profileId: 7,
        answers: data,
      });

      // Check if the response indicates success
      if (response.status !== 200) {
        throw new Error('Failed to submit answers');
      }*/

      // Compare answers
      let correct = 0;
      let wrong = 0;
      const wrongAnswers: number[] = []; // Array to store the indices of wrong answers

        questionSet.questions.forEach((question, index) => {
          const userAnswer = data[`question-${question.id}`]; // Get the user's answer
          
          if (userAnswer === question.answer) {
            correct++;
          } else {
            wrong++;
            wrongAnswers.push(index + 1); // Push the question number (1-based index)
          }
        });

      setCorrectCount(correct);
      setWrongCount(wrong);
      setWrongQuestions(wrongAnswers);

      toast.success('Submitted');
    } catch (error) {
      console.error('Error submitting answers:', error);
      toast.error('Failed to submit answers');
    }
  };

  return (
    <div>
      <div className="fixed top-40 left-10 bg-white z-50 p-4">
        <h1 className="text-xl font-bold">Test Timer : To be implemented</h1>
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

      {/* Display results */}
      <div className="mt-8 w-1/3">
        {/* Show the questions the user got wrong */}
        {(
          <div className="mt-4 w-full">
            <Card className='border-gray-400'>
              <CardHeader>
                <CardTitle className='text-2xl text-center'>Results</CardTitle>
              </CardHeader>
              <CardContent>
              <div className='flex flex-col gap-4 items-center'>
              <p className='text-4xl font-semibold text-gray-800'>{correctCount}/{wrongCount + correctCount}</p>
              {wrongQuestions.length > 0 && (
              <div>
              <h3 className="text-lg font-semibold">Questions you got wrong:</h3>
              <ul className='list-disc ml-5'>
                {wrongQuestions.map((questionNumber, index) => (
                  <li key={index} className='text-red-500 font-semibold'>
                    Question {questionNumber}
                  </li>
                ))}
              </ul>
              </div>
              )}
              </div>
              </CardContent>
            </Card>
          </div>
        )}

      </div>
    </div>
    </div>
  );
};

export default Test;
