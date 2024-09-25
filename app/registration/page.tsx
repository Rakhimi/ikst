import React from 'react'
import Registration from './Registration'
import Nav from "@/components/Navbar/Nav";
import MaxWidthWrapper from "@/components/MadWidthWrapper";

const RegistrationPage = async () => {



  return (
    <div>
    <Nav/>
    <MaxWidthWrapper>
    <Registration/>
    </MaxWidthWrapper>
    </div>
  )
}

export default RegistrationPage