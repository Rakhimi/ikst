import React from 'react'
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import getIndividualListing from '../actions/getIndividualListing';
import Dashboard from './Dashboard';

const Page = async () => {

  const listing = await getIndividualListing();


  return (
    <div>
    <MaxWidthWrapper>
    <Dashboard listing={listing} />
    </MaxWidthWrapper>
    </div>
  )
}

export default Page