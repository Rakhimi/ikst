'use client'

import React from 'react';
import { SessionProvider } from 'next-auth/react';
import Navbar from './Navbar';
import { usePathname } from 'next/navigation';
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
  currentUser: UserProps | null;
}

const Nav: React.FC<CurrentProps> = ({ currentUser }) => {
  const pathname = usePathname();

  // Hide the Navbar if the pathname includes /quranTest or /test
  const hideNavbar = pathname.includes('/quranTest') || pathname.includes('/test') || pathname.includes('/waitingRoom')

  return (
    <div>
      <SessionProvider>
        {!hideNavbar && <Navbar currentUser={currentUser} />}
      </SessionProvider>
    </div>
  );
}

export default Nav;
