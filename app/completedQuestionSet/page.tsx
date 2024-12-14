

import MaxWidthWrapper from '@/components/MaxWidthWrapper';
import React from 'react'
import getQuestionSet from '../actions/getQuestionSet'
import CompletedQuestionSet from './CompletedQuestionSet';

const Page: React.FC = async () => {
    
  const questionSets = await getQuestionSet(true);


  if(questionSets) {

  return (
    <div>
      <MaxWidthWrapper>
        <CompletedQuestionSet questionSets={questionSets}/>
      </MaxWidthWrapper>
    </div>
  );}
};

export default Page;
