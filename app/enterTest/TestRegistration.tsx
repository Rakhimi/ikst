'use client';

import React from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { verifyCode } from '@/lib/verifyCode'; // Make sure this path is correct
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

enum GradeOption {
  GR3 = 'GR3',
  GR7 = 'GR7'
}

type FormFields = {
  firstName: string;
  lastName: string;
  school: string;
  grade: GradeOption
  profileId: string;
};

const EnterTest = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormFields>();

  const router = useRouter();

  // Form submission handler
  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      const result = await verifyCode(
        data.firstName,
        data.lastName,
        data.school,
        data.grade,
        data.profileId
      );
  
      if (result.errors) {
        const error = result.errors;
        toast.error(error.key);
      } else {
        // Assuming result contains user information and you want to access user.id
        const userId = result.userId // Accessing user.id directly
        console.log(userId); // Check the userId
  
        // Pass the userId to the router push
        router.push(`/test/${data.grade}/${userId}`);
        toast.success('Code verified');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Something went wrong');
    }
  };
  

  return (
    <div className="my-10 flex flex-col items-center">
      <div className="w-1/3">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Take a test now</CardTitle>
          </CardHeader>
          <CardContent>
            {/* First Name */}
            <div className="mb-5">
              <Label>Student&apos;s First Name</Label>
              <Input
                placeholder="First Name"
                {...register('firstName', { required: 'First name is required' })}
              />
              {errors.firstName && (
                <div className="text-sm text-red-700">{errors.firstName.message}</div>
              )}
            </div>

            {/* Last Name */}
            <div className="mb-5">
              <Label>Student&apos;s Last Name</Label>
              <Input
                placeholder="Last Name"
                {...register('lastName', { required: 'Last name is required' })}
              />
              {errors.lastName && (
                <div className="text-sm text-red-700">{errors.lastName.message}</div>
              )}
            </div>

            {/* School */}
            <div className="mb-5">
              <Label>School</Label>
              <Select onValueChange={(value) => setValue('school', value)} defaultValue="">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select School" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALSTX">AlSalam Spring TX</SelectItem>
                  <SelectItem value="WDLTX">Woodland TX</SelectItem>
                  <SelectItem value="BILTX">Bilal ISGH TX</SelectItem>
                  <SelectItem value="MCAMI">MCA Ann Arbor</SelectItem>
                  <SelectItem value="MABIL">MABIL</SelectItem>
                </SelectContent>
              </Select>
              {errors.school && (
                <div className="text-sm text-red-700">{errors.school.message}</div>
              )}
            </div>

            {/* Grade */}
            <div className="mb-5">
              <Label>Grade</Label>
              <Select onValueChange={(value) => setValue('grade', value as GradeOption)} defaultValue="">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={GradeOption.GR3}>GR3</SelectItem>
                  <SelectItem value={GradeOption.GR7}>GR7</SelectItem>
                </SelectContent>
              </Select>
              {errors.grade && (
                <div className="text-sm text-red-700">{errors.grade.message}</div>
              )}
            </div>

            {/* Profile Code */}
            <div className="mb-5">
              <Label>Code</Label>
              <Input
                placeholder="Code"
                {...register('profileId', { required: 'Code is required' })}
              />
              {errors.profileId && (
                <div className="text-sm text-red-700">{errors.profileId.message}</div>
              )}
            </div>
          </CardContent>

          <CardFooter>
            <Button onClick={handleSubmit(onSubmit)}>Enter</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default EnterTest;
