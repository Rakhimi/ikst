
import React from 'react'
import MaxWidthWrapper from "@/components/MadWidthWrapper";
import RegisterExam from './RegisterExam';
import getCurrentUser from '../actions/getCurrentUser';

const RegisterExamPage = async () => {

  const currentUser = await getCurrentUser();


  return (
    <div>
    <MaxWidthWrapper>
    <RegisterExam currentUser={currentUser}/>
    </MaxWidthWrapper>
    </div>
  )
}

export default RegisterExamPage