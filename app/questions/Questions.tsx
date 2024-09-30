'use client'

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray, Controller, SubmitHandler } from "react-hook-form";
import axios from 'axios';
import { FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

enum AnswerOption {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

interface Question {
    id?:number;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    isAdded: boolean;
    answer: AnswerOption | '';
}

interface FormValues {
    questions: Question[];
    title: string;
}

interface QuestionsProps {
    initialData?: FormValues; // Accept initial data as props
}

const Questions: React.FC<QuestionsProps> = ({ initialData }) => {
    const { register, control, watch, handleSubmit, reset } = useForm<FormValues>({
        defaultValues: initialData || {
            questions: [{ question: '', option1: '', option2: '', option3: '', option4: '', isAdded: false, answer: '' }],
            title: ''
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const { fields, append, remove, update } = useFieldArray({
        control,
        name: "questions",
    });

    // Effect to reset the form with initial data when it changes
    useEffect(() => {
        if (initialData) {
            reset(initialData);
        }
    }, [initialData, reset]);

    const handleAppend = (index: number) => {
        const question = watch(`questions.${index}.question`);
        const option1 = watch(`questions.${index}.option1`);
        const option2 = watch(`questions.${index}.option2`);
        const option3 = watch(`questions.${index}.option3`);
        const option4 = watch(`questions.${index}.option4`);
        const answer = watch(`questions.${index}.answer`);
    
        // Validation to ensure all required fields are filled
        if (!question || !option1 || !option2 || !option3 || !option4 || !answer) {
            toast.error('Please fill out the question, all 4 options, and select the correct answer before adding.');
            return;
        }

        const questionId = initialData?.questions[index]?.id ?? undefined;

        console.log(questionId);


        const currentQuestion = fields[index];
        const updatedQuestion = {
            ...currentQuestion,
            question,
            option1,
            option2,
            option3,
            option4,
            answer,
            isAdded: true,
            
            ...(questionId && { id: questionId }),
        };
    
        console.log(updatedQuestion);
        
        // Update the existing question
        update(index, updatedQuestion);
        
        // Append a new question without an ID, or with a placeholder if necessary
        append({ 
            question: '', 
            option1: '', 
            option2: '', 
            option3: '', 
            option4: '', 
            isAdded: false, 
            answer: '' 
        });
    };
    

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setIsLoading(true);

        try {
            const endpoint = initialData ? '/api/update-questions' : '/api/create-questions';
            console.log(data)
            const result = await axios.post(endpoint, data);
            const id = result.data.id;
            toast.success('Questions submitted successfully!');
            router.push(`/questionsReview/${id}`);
            router.refresh();
        } catch (error) {
            console.error("Error submitting questions:", error);
            toast.error('Failed to submit questions. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full mb-20">
            <h1 className='py-4 font-bold text-2xl'>{initialData ? 'Edit Questionnaire' : 'Create Questionnaire'}</h1>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className='my-5'>
                    <Label className='text-lg font-semibold'>Name</Label>
                    <Input
                        type="text"
                        {...register('title', { required: 'This is required' })}
                        className="w-1/2 border rounded p-2 flex-1 border-gray-300"
                        placeholder="Questions Set Name"
                    />
                </div>
                <div className='mb-5'>
                    <Label className='font-semibold'>Make sure to fill everything including the correct answer</Label>
                </div>

                {fields.length === 0 ? (
                    <div className="flex justify-center py-4">
                        <button
                            onClick={() => append({ question: '', option1: '', option2: '', option3: '', option4: '', isAdded: false, answer: '' })}
                            className="text-sky-500 font-bold px-2"
                        >
                            <FaPlusCircle className='text-3xl' />
                        </button>
                    </div>
                ) : (
                    fields.map((field, index) => {
                        const isReadyToAdd = watch(`questions.${index}.question`) &&
                            watch(`questions.${index}.option1`) &&
                            watch(`questions.${index}.option2`) &&
                            watch(`questions.${index}.option3`) &&
                            watch(`questions.${index}.option4`) &&
                            watch(`questions.${index}.answer`);

                        return (
                            <div key={field.id} className="flex flex-col gap-4 mb-4 border-2 py-3 px-2 rounded-md border-gray-400">
                                <h2 className='font-semibold'>{`Question ${index + 1}`}</h2>

                                <Textarea
                                    {...register(`questions.${index}.question`, { required: 'This is required' })}
                                    className="border rounded p-2 flex-1 border-gray-300"
                                    placeholder="Question"
                                />
                                <Input
                                    type="text"
                                    {...register(`questions.${index}.option1`, { required: 'This is required' })}
                                    className="w-1/2 border rounded p-2 flex-1 border-gray-300"
                                    placeholder="Option A"
                                />
                                <Input
                                    type="text"
                                    {...register(`questions.${index}.option2`, { required: 'This is required' })}
                                    className="w-1/2 border rounded p-2 flex-1 border-gray-300"
                                    placeholder="Option B"
                                />
                                <Input
                                    type="text"
                                    {...register(`questions.${index}.option3`, { required: 'This is required' })}
                                    className="w-1/2 border rounded p-2 flex-1 border-gray-300"
                                    placeholder="Option C"
                                />
                                <Input
                                    type="text"
                                    {...register(`questions.${index}.option4`, { required: 'This is required' })}
                                    className="w-1/2 border rounded p-2 flex-1 border-gray-300"
                                    placeholder="Option D"
                                />
                                <Controller
                                    name={`questions.${index}.answer`}
                                    rules={{ required: true }}
                                    control={control}
                                    render={({ field }) => (
                                        <Select {...field} value={field.value || ''} onValueChange={field.onChange}>
                                            <SelectTrigger className="w-[180px] border border-gray-400">
                                                <SelectValue placeholder="Correct Answer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value={AnswerOption.A}>A</SelectItem>
                                                <SelectItem value={AnswerOption.B}>B</SelectItem>
                                                <SelectItem value={AnswerOption.C}>C</SelectItem>
                                                <SelectItem value={AnswerOption.D}>D</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <div className="flex items-center">
                                    <button onClick={() => remove(index)} className="text-red-700 font-bold px-2">
                                        <FaMinusCircle className='text-3xl' />
                                    </button>
                                    {index === fields.length - 1 && (
                                        <button
                                            onClick={() => handleAppend(index)}
                                            className={`text-sky-500 font-bold px-2 ${!isReadyToAdd ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            disabled={!isReadyToAdd}
                                        >
                                            <FaPlusCircle className='text-3xl' />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
                <div className="w-full flex justify-between items-center mt-4">
                    <span className='text-lg font-semibold'>Total Questions: {fields.length}</span>
                    <Button
                        type="submit"
                        className="bg-sky-500 text-white p-2 rounded"
                        disabled={isLoading}
                    >
                        {initialData ? 'Update Questions' : 'Submit All Questions'}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default Questions;
