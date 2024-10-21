'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from "react-hot-toast";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useModal } from '@/components/Modal/ModalContext';


interface CurrentUser {
  createdAt: string;
  updatedAt: string;
  id: number;
  email: string;
  hashedPassword: string;
}

interface RegisterExamProps {
  currentUser: CurrentUser | null;
}

enum GradeOption {
  GR3 = 'GR3',
  GR7 = 'GR7'
}

enum SchoolOption {
  ALSTX = 'ALSTX',
  WDLTX = 'WDLTX',
  BILTX = 'BILTX',
  MCAMI = 'MCAMI',
  MABIL = 'MABIL'
}

type FormFields = {
  firstName: string;
  lastName:string;
  school: SchoolOption
  grade: GradeOption
};

const RegisterExam: React.FC<RegisterExamProps> = ({ currentUser }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormFields>();

  const router = useRouter();

  const { openLoginModal } = useModal();


  function generateRandomCode(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }


  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!currentUser) {
      // If the user is not logged in, prompt them to sign in
      toast.error('You need to sign in to register');
      openLoginModal(); // Open the login modal
      return;
    }
  
    // Generate the random 10-character code
    const code = generateRandomCode(10);
  
    try {
      // Add the generated code to the form data
      const response = await axios.post('/api/register-exam', {
        ...data,
        code,  // Include the generated code in the request body
      });
  
      if (response.status !== 200) {
        throw new Error('Registration failed');
      }
  
      // Handle success response
      toast.success('Registration successful');
      router.push('/dashboard');  // Navigate to dashboard on success
      router.refresh();  // Optional: refresh the page
      
    } catch (error) {
      console.error('Error during registration:', error);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <div className='flex justify-center my-10'>
      <div className='w-1/3'>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Register for the test</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='mb-8'>
                <Label>Student&apos;s First Name</Label>
                <Input
                  placeholder='Name'
                  {...register('firstName', { required: 'Name is required' })}
                />
                {errors.firstName && (
                  <div className='text-sm text-red-700'>
                    {errors.firstName.message}
                  </div>
                )}
              </div>
              <div className='mb-8'>
                <Label>Student&apos;s Last Name</Label>
                <Input
                  placeholder='Name'
                  {...register('lastName', { required: 'Name is required' })}
                />
                {errors.lastName && (
                  <div className='text-sm text-red-700'>
                    {errors.lastName.message}
                  </div>
                )}
              </div>
              <div className='mb-8'>
                <Label>School</Label>
                <Select
                  onValueChange={(value) => setValue('school', value as SchoolOption)}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SchoolOption.ALSTX}>AlSalam Spring TX</SelectItem>
                    <SelectItem value={SchoolOption.WDLTX}>Woodland TX</SelectItem>
                    <SelectItem value={SchoolOption.BILTX}>Bilal ISGH TX</SelectItem>
                    <SelectItem value={SchoolOption.MCAMI}>MCA Ann Arbor</SelectItem>
                    <SelectItem value={SchoolOption.MABIL}>MABIL</SelectItem>
                  </SelectContent>
                </Select>
                {errors.school && (
                  <div className='text-sm text-red-700'>
                    {errors.school.message}
                  </div>
                )}
              </div>
              <div className='mb-8'>
                <Label>Grade</Label>
                <Select
                  onValueChange={(value) => setValue('grade', value as GradeOption)}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={GradeOption.GR3}>GR3</SelectItem>
                    <SelectItem value={GradeOption.GR7}>GR7</SelectItem>
                  </SelectContent>
                </Select>
                {errors.grade && (
                  <div className='text-sm text-red-700'>
                    {errors.grade.message}
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button type='submit'>Register</Button>
            </CardFooter>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default RegisterExam;
