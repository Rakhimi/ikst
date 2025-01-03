import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import QuestionsReview from '../QuestionsReview'
import getQuestions from '../../actions/getQuestions'


const page = async ({ params }: { params: { id: [number, boolean] }}) => {

  
  const [id, completed] = params.id;

  console.log(completed)

  const questionSet = await getQuestions(Number(id));

  

  return (
    <div>
        <MaxWidthWrapper>
          <QuestionsReview questionSet={questionSet} id={id} />
        </MaxWidthWrapper>
    </div>
  )
}

export default page