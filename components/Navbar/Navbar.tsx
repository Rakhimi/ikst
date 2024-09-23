'use client'

import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useSession, signOut } from "next-auth/react";
import { useModal } from '../Modal/ModalContext';
import { usePathname } from 'next/navigation';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { openRegisterModal, openLoginModal } = useModal();
  const { data: session } = useSession();
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-white text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 justify-end">
          <div className="hidden md:flex space-x-4">
            <a
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
            >
              Home
            </a>
            <a
              href="/registration"
              className={`px-3 py-2 rounded-md text-sm font-medium ${(isActive('/registration') || isActive('/registerExam')) ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
            >
              Registration
            </a>
            <a
              href="/dates"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/dates') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
            >
              Testing Dates
            </a>
            <a
              href="/topics"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/topics') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
            >
              Study Topics
            </a>
            <a
              href="/materials"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/materials') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
            >
              Study Materials
            </a>
            {session ? (
              <>
              <a
                href="#"
                onClick={() => signOut()}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
              >
                Sign out
              </a>
              <a
              href="/admin"
              className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/admin') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
            >
              Admin
            </a>
            </>
            ) : (
              <>
                <a
                  href="#"
                  onClick={openLoginModal}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  Login
                </a>
                <a
                  href="#"
                  onClick={openRegisterModal}
                  className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-200"
                >
                  Register
                </a>
              </>
            )}
          </div>
          <div className="md:hidden">
            <button onClick={toggleMenu} className="focus:outline-none">
              {isOpen ? (
                <FaTimes className="h-6 w-6" />
              ) : (
                <FaBars className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <a
            href="/"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
          >
            Home
          </a>
          <a
            href="/registration"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/registration') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
          >
            Registration
          </a>
          <a
            href="#"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/testing-dates') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
          >
            Testing Dates
          </a>
          <a
            href="#"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/study-topics') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
          >
            Study Topics
          </a>
          <a
            href="#"
            className={`block px-3 py-2 rounded-md text-base font-medium ${isActive('/study-materials') ? 'bg-gray-900 text-white' : 'hover:bg-gray-200'}`}
          >
            Study Materials
          </a>
          {session ? (
            <a
              href="#"
              onClick={() => signOut()}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200"
            >
              Sign out
            </a>
          ) : (
            <>
              <a
                href="#"
                onClick={openLoginModal}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200"
              >
                Login
              </a>
              <a
                href="#"
                onClick={openRegisterModal}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-200"
              >
                Register
              </a>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
