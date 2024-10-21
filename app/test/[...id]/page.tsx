import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import Test from '../Test'
import getIslamicSet from '@/app/actions/getIslamicSet'

enum GradeOption {
  GR3 = 'GR3',
  GR7 = 'GR7'
}

const page = async ({ params }: { params: { id: [GradeOption, number] } }) => {
  const [grade, userId] = params.id; // Destructure id array to extract grade and userId

  const questionSet = await getIslamicSet(grade as GradeOption);

  return (
    <div>
      <MaxWidthWrapper>
        {/* Ensure questionSet is passed after being resolved */}
        <Test questionSet={questionSet} profileId={userId} />
      </MaxWidthWrapper>
    </div>
  )
}

export default page;
