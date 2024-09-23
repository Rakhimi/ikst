'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
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

type FormFields = {
  name: string;
  school: string;
  grade: string;
};

const RegisterExam = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormFields>();

  const router = useRouter()

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    
    try {
      const response = await fetch('/api/register-exam', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Registration failed');
      }
  
      await response.json();
      toast.success('Registration successful');

      router.push('/admin');
  
    } catch (error) {
      console.error('Error during registration:', error);
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
                <Label>Student&apos;s Name</Label>
                <Input
                  placeholder='Name'
                  {...register('name', { required: 'Name is required' })}
                />
                {errors.name && (
                  <div className='text-sm text-red-700'>
                    {errors.name.message}
                  </div>
                )}
              </div>
              <div className='mb-8'>
                <Label>School</Label>
                <Select
                  onValueChange={(value) => setValue('school', value)}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select School" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALSTX">AlSalam Spring TX</SelectItem>
                    <SelectItem value="WDLTX">Woodland TX</SelectItem>
                    <SelectItem value="BILTX">Bilal ISGH TX</SelectItem>
                    <SelectItem value="MCAMI">MCA Ann Arbor</SelectItem>
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
                  onValueChange={(value) => setValue('grade', value)}
                  defaultValue=""
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GR3">GR3</SelectItem>
                    <SelectItem value="GR7">GR7</SelectItem>
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
