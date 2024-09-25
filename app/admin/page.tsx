import React from 'react';
import MaxWidthWrapper from "@/components/MadWidthWrapper";
import Nav from "@/components/Navbar/Nav";
import getListings from '../actions/getListings';
import Admin from './Admin';



const Page = async () => {

  
  const listings = await getListings();

  if (listings.length === 0) {
    return (
      <div>
        <Nav />
        <MaxWidthWrapper>
          <div>Error: No listings found.</div>
        </MaxWidthWrapper>
      </div>
    );
  }

  return (
    <div>
      <Nav />
      <MaxWidthWrapper>
        <Admin listings={listings} />
      </MaxWidthWrapper>
    </div>
  );
};

export default Page;
