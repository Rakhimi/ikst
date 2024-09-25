
import React from 'react'
import Nav from "@/components/Navbar/Nav";
import MaxWidthWrapper from "@/components/MadWidthWrapper";
import RegisterExam from './RegisterExam';
import getCurrentUser from '../actions/getCurrentUser';

const RegisterExamPage = async () => {

  const currentUser = await getCurrentUser();


  return (
    <div>
    <Nav/>
    <MaxWidthWrapper>
    <RegisterExam currentUser={currentUser}/>
    </MaxWidthWrapper>
    </div>
  )
}

export default RegisterExamPage