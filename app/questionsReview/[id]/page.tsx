import MaxWidthWrapper from '@/components/MadWidthWrapper'
import React from 'react'
import QuestionsReview from '../QuestionsReview'
import getQuestionSet from '../../actions/getQuestions'


const page = async ({ params }: { params: { id: number}}) => {

  
  const { id } = params;

  console.log(id)

  const questionSet = await getQuestionSet(Number(id));

  

  return (
    <div>
        <MaxWidthWrapper>
          <QuestionsReview questionSet={questionSet}/>
        </MaxWidthWrapper>
    </div>
  )
}

export default page