
import React from 'react'
import Nav from "@/components/Navbar/Nav";
import MaxWidthWrapper from "@/components/MadWidthWrapper";
import RegisterExam from './RegisterExam';

const RegisterExamPage = () => {
  return (
    <div>
    <Nav/>
    <MaxWidthWrapper>
    <RegisterExam/>
    </MaxWidthWrapper>
    </div>
  )
}

export default RegisterExamPage