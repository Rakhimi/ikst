'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import Navbar from './Navbar'
import { $Enums } from '@prisma/client';


interface UserProps {
  createdAt: string;
  updatedAt: string;
  id: number;
  email: string;
  hashedPassword: string;
  maiden: string;
  sport: string;
  color: string;
  role: $Enums.UserRole;
}

interface CurrentProps {
  currentUser: Promise<UserProps | null>;
}


const Nav: React.FC<CurrentProps> = ({ currentUser }) => {
  return (
    <div>
        <SessionProvider>
            <Navbar currentUser={currentUser}/>
        </SessionProvider>
    </div>
  )
}

export default Nav