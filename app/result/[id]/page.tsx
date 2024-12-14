import React from 'react'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import { getIndividualResult2 } from '@/app/actions/getIndividualResult2'
import ProfileResult from '../Result'

const page = async ({ params }: { params: { id: number}}) => {

  console.log('Params:', params);
  const { id } = params;

  console.log(id)

  const individualResult2 = await getIndividualResult2(Number(id));


  return (
    <div>
    <MaxWidthWrapper>
    <ProfileResult profile={individualResult2.profile} results={individualResult2.results} averages={individualResult2.averages}/>
    </MaxWidthWrapper>
    </div>
  )
}

export default page