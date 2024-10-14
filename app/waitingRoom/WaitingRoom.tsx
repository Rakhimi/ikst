'use client'

import React from 'react'

import { useCountdownTimer } from '@/components/hooks/useTimer';
import { GradeOption } from '@prisma/client';
import { useRouter } from 'next/navigation';

interface WaitingRoomProps {
    secondsLeft: number;
    grade: GradeOption;
    userId: number;
  }
  
  const WaitingRoom: React.FC<WaitingRoomProps> = ({ secondsLeft, grade, userId }) => {

    const router = useRouter();

    
    const { formattedTime } = useCountdownTimer( secondsLeft, () => router.push(`/quranTest/${grade}/${userId}`));

    


    return (
      <div className='text-center mt-20'>
        <h1 className='font-semibold text-3xl'>Waiting Room</h1>
        <p className='font-semibold text-2xl'>Time left before the next test: </p>
        <p className='font-semibold text-3xl'>{ formattedTime }</p>
      </div>
    );
  };
  
  export default WaitingRoom;