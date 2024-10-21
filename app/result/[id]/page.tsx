import React from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import getIndividualResult from '@/app/actions/getIndividualResult'
import ProfileResult from '../Result'

const page = async ({ params }: { params: { id: number}}) => {

  console.log('Params:', params);
  const { id } = params;

  console.log(id)

  const individualResult = await getIndividualResult(Number(id));


  return (
    <div>
    <MaxWidthWrapper>
    <ProfileResult profile={individualResult}/>
    </MaxWidthWrapper>
    </div>
  )
}

export default page