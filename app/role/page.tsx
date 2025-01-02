import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import getUsers from '../actions/getUsers'
import Role from './Role'


const Page: React.FC = async () => {

    const users = await getUsers();

  return (
    <div>
      <MaxWidthWrapper>
        <Role users={users}/>
      </MaxWidthWrapper>
    </div>
  )
}

export default Page;
