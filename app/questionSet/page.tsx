

import MaxWidthWrapper from '@/components/MadWidthWrapper';
import React from 'react'
import getQuestionSet from '../actions/getQuestionSet'
import QuestionSet from './QuestionSet';

const Page: React.FC = async () => {
    
  const questionSets = await getQuestionSet();


  

  if(questionSets) {

  return (
    <div>
      <MaxWidthWrapper>
        <QuestionSet questionSets={questionSets}/>
      </MaxWidthWrapper>
    </div>
  );}
};

export default Page;
