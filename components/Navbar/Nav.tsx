'use client'

import React from 'react'
import { SessionProvider } from 'next-auth/react'
import Navbar from './Navbar'

const Nav = () => {
  return (
    <div>
        <SessionProvider>
            <Navbar/>
        </SessionProvider>
    </div>
  )
}

export default Nav