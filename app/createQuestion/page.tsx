import React from 'react'
import CreateQuestions from './CreateQuestion'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'

const page = () => {
  return (
    <div>
        <MaxWidthWrapper>
        <CreateQuestions/>
        </MaxWidthWrapper>
    </div>
  )
}

export default page