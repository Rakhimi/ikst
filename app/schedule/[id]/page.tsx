import MaxWidthWrapper from '@/components/MadWidthWrapper';
import React from 'react';
import Schedule from '../Schedule';

const page = async ({ params }: { params: { id: number } }) => {

  const { id } = params; // Destructure id from params

  return (
    <div>
      <MaxWidthWrapper>
        <Schedule id={id} /> {/* Pass id directly */}
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
