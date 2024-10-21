

import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import QuranTest from '../QuranTest';
import getQuranSet from '@/app/actions/getQuranSet';

enum GradeOption {
  GR3 = 'GR3',
  GR7 = 'GR7'
}


const page = async ({ params }: { params: { id: [GradeOption, number] } }) => {

  const [grade, userId] = params.id

  const questionSet = await getQuranSet(grade);

  return (
    <div>
    <MaxWidthWrapper>
    <QuranTest questionSet={questionSet} profileId={userId}/>
    </MaxWidthWrapper>
    </div>
  )
}

export default page