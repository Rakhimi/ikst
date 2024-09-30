import React from 'react';
import Questions from './Questions';
import MaxWidthWrapper from '@/components/MadWidthWrapper';

const Page = async ({ searchParams }: { searchParams: { initialData: string } }) => {
  
  const encodedInitialData = searchParams.initialData;

  const decodedInitialData = decodeURIComponent(encodedInitialData);

  // Parse the decoded data to JSON
  let initialData;
  try {
    initialData = JSON.parse(decodedInitialData);
  } catch (error) {
    console.error("Error parsing initialData:", error);
  }

  console.log("Parsed initialData:", initialData);

  return (
    <div>
      <MaxWidthWrapper>
        {/* Pass the initial data to your Questions component if necessary */}
        <Questions initialData={initialData} />
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;
