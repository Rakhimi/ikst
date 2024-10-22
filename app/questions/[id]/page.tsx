import React from 'react';
import Questions from '../Questions';
import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import getQuestions from '@/app/actions/getQuestions';

const page = async ({ params }: { params: { id: number}}) => {

  const { id } = params;

  const initialData = await getQuestions(Number(id));

  if (!initialData) {
    return (
      <div>
        Not Available
      </div>
    )
  }
  
  return (
    <div>
      <MaxWidthWrapper>
        {/* Pass the initial data to your Questions component if necessary */}
        <Questions initialData={initialData} />
      </MaxWidthWrapper>
    </div>
  );
};

export default page;
