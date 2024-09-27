import React from 'react'
import Questions from './Questions'
import MaxWidthWrapper from '@/components/MadWidthWrapper'

const page = () => {
  return (
    <div>
        <MaxWidthWrapper>
        <Questions/>
        </MaxWidthWrapper>
    </div>
  )
}

export default page