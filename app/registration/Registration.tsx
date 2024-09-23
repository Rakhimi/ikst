'use client'

import Image from 'next/image'
import React from 'react'

const Registration = () => {
  return (
    <div className='my-10 px-4'>
      <div className="text-center">
        <h1 className="text-2xl md:text-6xl font-semibold">REGISTRATION</h1>
      </div>
      <div className='mt-10'>
        <a href="/registerExam" className="block max-w-sm mx-auto bg-gray-100 rounded-lg shadow-lg overflow-hidden transition-transform transform hover:scale-105 hover:bg-sky-200 cursor-pointer">
          <div className='relative'>
            <Image
              src="/studentRegistration.jpg"
              alt="Student Registration"
              width={500}
              height={300}
              className="w-full object-cover"
            />
          </div>
          <div className="p-6 text-center">
            <h2 className="text-2xl font-semibold mb-2">STUDENT REGISTRATION</h2>
            <p className="text-gray-600">For Students who are not part of any school and like to evaluate</p>
          </div>
        </a>
      </div>
    </div>
  )
}

export default Registration
