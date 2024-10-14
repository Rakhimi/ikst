import MaxWidthWrapper from '@/components/MadWidthWrapper'
import React from 'react'
import WaitingRoom from '../WaitingRoom'
import { GradeOption } from '@prisma/client';

const page = async ({ params }: { params: { id: [string, GradeOption, number] } }) => {
  // Extract 'id' from params and treat it as seconds
  const [seconds, grade, userId] = params.id // Convert 'id' from string to number

  const secondsNumber = parseInt(seconds,10);

  // Handle case where conversion to number fails
  if (isNaN(secondsNumber)) {
    return <div>Invalid seconds value</div>;
  }

  console.log(seconds); // Check the value of seconds

  return (
    <div>
      <MaxWidthWrapper>
        <WaitingRoom secondsLeft={secondsNumber} grade={grade} userId={userId}/>
      </MaxWidthWrapper>
    </div>
  );
}

export default page;
