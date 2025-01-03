

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React from 'react'
import getQuestionSet from '../actions/getQuestionSet'
import QuestionSet from './QuestionSet';

const Page: React.FC = async () => {
    
  const questionSets = await getQuestionSet(false);


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
