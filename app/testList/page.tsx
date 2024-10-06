import MaxWidthWrapper from '@/components/MadWidthWrapper'
import React from 'react'
import TestList from './testList'
import getQuestionSet from '../actions/getQuestionSet'

const Page: React.FC = async () => {

    const questionSets = await getQuestionSet();

  return (
    <div>
        <MaxWidthWrapper>
            <TestList questionSets={questionSets}/>
        </MaxWidthWrapper>
    </div>
  )
}

export default Page