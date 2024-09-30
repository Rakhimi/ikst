

import MaxWidthWrapper from '@/components/MadWidthWrapper'
import React from 'react'
import getQuestionSet from '../actions/getQuestions'
import Test from './Test'


const page = async () => {

    const questionSet = await getQuestionSet(3);


  return (
    <div>
    <MaxWidthWrapper>
    <Test questionSet={questionSet}/>
    </MaxWidthWrapper>
    </div>
  )
}

export default page