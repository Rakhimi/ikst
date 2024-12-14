import React from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import ResultSetList from './ResultSetList'

import getResultCycleList from '../actions/getResultCycleList'

const Page: React.FC = async () => {

    const cycles = (await getResultCycleList()) || [];

  return (
    <div>
    <MaxWidthWrapper>
    <ResultSetList cycles={cycles}/>
    </MaxWidthWrapper>
    </div>
  )
}

export default Page