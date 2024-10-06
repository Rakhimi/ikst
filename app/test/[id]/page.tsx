

import MaxWidthWrapper from '@/components/MadWidthWrapper'
import React from 'react'
import getQuestions from '../../actions/getQuestions'
import Test from '../Test'


const page = async ({ params }: { params: { id: number}}) => {

  const { id } = params;

  const questionSet = await getQuestions(Number(id));


  return (
    <div>
    <MaxWidthWrapper>
    <Test questionSet={questionSet}/>
    </MaxWidthWrapper>
    </div>
  )
}

export default page