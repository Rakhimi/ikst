import React from 'react'
import MaxWidthWrapper from "@/components/MadWidthWrapper";
import Nav from "@/components/Navbar/Nav";
import getIndividualListing from '../actions/getIndividualListing';
import Dashboard from './Dashboard';


const Page = async () => {

  const listing = await getIndividualListing();

  if (!listing) {
    return (
      <div>
        <Nav />
        <MaxWidthWrapper>
          <div>No profile</div>
        </MaxWidthWrapper>
      </div>
    );
  }

  return (
    <div>
    <Nav />
    <MaxWidthWrapper>
    <Dashboard listing={listing} />
    </MaxWidthWrapper>
    </div>
  )
}

export default Page