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

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from '@/components/ui/card';

import { Calendar } from '@/components/ui/calendar';

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from '@/components/ui/popover';

enum AnswerOption {
    A = 'A',
    B = 'B',
    C = 'C',
    D = 'D',
}

enum GradeOption {
    GR3='GR3',
    GR7='GR7'
}

enum TypeOption {
    Islamic='Islamic',
    Quran='Quran'
}

interface Question {
    id?:number;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
    answer: AnswerOption | '';
}

interface FormValues {
    questions: Question[];
    title: string;
    grade: GradeOption;
    type: TypeOption;
    startTime: string; // We'll store it as a string, then combine date & time
    endTime: string;
}

interface QuestionsProps {
    initialData: FormValues;
}

const Questions: React.FC<QuestionsProps> = ({ initialData }) => {
    const { register, control, watch, handleSubmit, reset, formState: { errors }, } = useForm<FormValues>({
        defaultValues: initialData || {
            questions: [{ question: '', option1: '', option2: '', option3: '', option4: '', answer: '' }],
            title: ''
        },
    });

    const [isLoading, setIsLoading] = useState(false);
    const [date, setDate] = useState<Date>();
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

        


        const currentQuestion = fields[index];
        const updatedId = Number(currentQuestion.id)
        const updatedQuestion = {
            ...currentQuestion,
            question,
            option1,
            option2,
            option3,
            option4,
            answer,
            isAdded: true,
            id: updatedId
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
            answer: '' 
        });
    };
    

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        if (!date) {
            toast.error('Please select a date');
            return;
        }
    
        // Clone the selected date for both start and end times
        const startDateTime = new Date(date);
        const endDateTime = new Date(date);
    
        // Extract hours and minutes from the startTime and endTime strings
        const [startHour, startMinute] = data.startTime.split(':').map(Number);
        const [endHour, endMinute] = data.endTime.split(':').map(Number);
    
        // Set the hours and minutes on the startDateTime and endDateTime objects
        startDateTime.setHours(startHour, startMinute);
        endDateTime.setHours(endHour, endMinute);
    
        // Update the data object to include the combined date and time as ISO strings
        const updatedData = {
            ...data,
            startTime: data.startTime, 
            endTime: data.endTime   
        };
    
        setIsLoading(true);
    
        try {
    
            // Use the updatedData object in the request
            const result = await axios.post('/api/update-questions', updatedData);
            const id = result.data.id;
            toast.success('Questions submitted successfully!');
            router.push(`/questionsReview/${id}`);
            router.refresh();
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
            console.error("Error submitting questions:", error);
            if (error.response && error.response.data && error.response.data.error) {
                toast.error(error.response.data.error); // Show the specific error message
            } else {
                toast.error('Failed to submit questions. Please try again.');
            }
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
                <div className='flex gap-4 mb-5'>
                <Controller
                    name={'grade'}
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                        <Select {...field} value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger className="w-[180px] border border-gray-400">
                                <SelectValue placeholder="Grade" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={GradeOption.GR3}>GR3</SelectItem>
                                <SelectItem value={GradeOption.GR7}>GR7</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                <Controller
                    name={'type'}
                    rules={{ required: true }}
                    control={control}
                    render={({ field }) => (
                        <Select {...field} value={field.value || ''} onValueChange={field.onChange}>
                            <SelectTrigger className="w-[180px] border border-gray-400">
                                <SelectValue placeholder="Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={TypeOption.Islamic}>Islamic Studies</SelectItem>
                                <SelectItem value={TypeOption.Quran}>Quran</SelectItem>
                            </SelectContent>
                        </Select>
                    )}
                />
                </div>



                <div className="my-10 flex flex-col">
                <div className="w-1/3">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Set a date</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant={'outline'}
                                    className={`${!date ? 'text-muted-foreground' : ''}`}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={date}
                                    onSelect={setDate}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>

                        {/* Start Time Input */}
                        <div className="mt-10">
                            <Label className="text-lg font-semibold">Start time</Label>
                            <Input
                                placeholder="Start time (e.g. 09:00)"
                                {...register('startTime', { required: 'Start time is required' })}
                            />
                            {errors.startTime && (
                                <span className="text-red-500">{errors.startTime.message}</span>
                            )}
                        </div>

                        {/* End Time Input */}
                        <div className="mt-10">
                            <Label className="text-lg font-semibold">End time</Label>
                            <Input
                                placeholder="End time (e.g. 12:00)"
                                {...register('endTime', { required: 'End time is required' })}
                            />
                            {errors.endTime && (
                                <span className="text-red-500">{errors.endTime.message}</span>
                            )}
                        </div>
                    </CardContent>
                </Card>
                </div>
                </div>



                <div className='mb-5'>
                    <Label className='font-semibold'>Make sure to fill everything including the correct answer</Label>
                </div>

                {fields.length === 0 ? (
                    <div className="flex justify-center py-4">
                        <button
                            onClick={() => append({ question: '', option1: '', option2: '', option3: '', option4: '', answer: '' })}
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
