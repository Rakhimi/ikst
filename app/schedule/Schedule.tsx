'use client';

import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type FormFields = {
  startTime: string; // We'll store it as a string, then combine date & time
  endTime: string;
};

type ScheduleProps = {
  id: number;
};

const Schedule: React.FC<ScheduleProps> = ({ id }) => {
  const [date, setDate] = useState<Date>(); // Manage the selected date
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();

  const router = useRouter();


  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    if (!date) {
      toast.error('Please select a date');
      return;
    }

    // Combine the selected date with startTime and endTime inputs
    const startDateTime = new Date(date); // Clone the selected date
    const endDateTime = new Date(date);

    const [startHour, startMinute] = data.startTime.split(':').map(Number);
    const [endHour, endMinute] = data.endTime.split(':').map(Number);

    startDateTime.setHours(startHour, startMinute);
    endDateTime.setHours(endHour, endMinute);

    try {
      await axios.post('/api/create-schedule', {
        startTime: startDateTime.toISOString(), // Send ISO format
        endTime: endDateTime.toISOString(),
        questionSetId: id,

      });
      console.log(startDateTime)
      router.push('/questionSet')
      toast.success('Test scheduled successfully!');
    } catch (error) {
      toast.error('Failed to schedule the test');
      console.log(error)
    }
  };

  return (
    <div className="my-10 flex flex-col items-center">
      <div className="w-1/3">
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-2xl">Set a test</CardTitle>
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
          <CardFooter>
            <Button onClick={handleSubmit(onSubmit)}>Set Test</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Schedule;
