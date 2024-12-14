import React from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { getResultCycle } from '@/app/actions/getResultCycle'
import ResultSet from '../ResultSet';


const page = async ({ params }: { params: { id: [number, string] }}) => {

  const [id, encodedName] = params.id;

  // Decode the name to get the original value
  const name = decodeURIComponent(encodedName);

  const cycle = await getResultCycle(Number(id));


  return (
    <div>
    <MaxWidthWrapper>
    <ResultSet groupedResults={cycle} name={name}/>
    </MaxWidthWrapper>
    </div>
  )
}

export default page