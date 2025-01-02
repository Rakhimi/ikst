import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import React from 'react'
import getUserList from '../actions/getUsers'
import Role from './Role'


const Page: React.FC = async () => {

    const users = await getUserList();

    if (!users) {
      return <div>No users</div>;
    }

  return (
    <div>
      <MaxWidthWrapper>
        <Role users={users}/>
      </MaxWidthWrapper>
    </div>
  )
}

export default Page
