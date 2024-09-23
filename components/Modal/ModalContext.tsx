'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of your context value
interface ModalContextType {
  isOpenRegister: boolean;
  openRegisterModal: () => void;
  closeRegisterModal: () => void;
  isOpenLogin: boolean;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

// Create the context with a default value
const ModalContext = createContext<ModalContextType | undefined>(undefined);

// Custom hook to use the ModalContext
export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};

// Define the props for the ModalProvider component
interface ModalProviderProps {
  children: ReactNode; // Allows any valid React node to be passed as children
}

// Provider component
export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
  const [isOpenRegister, setIsOpenRegister] = useState(false);
  const [isOpenLogin, setIsOpenLogin] = useState(false);

  const openRegisterModal = () => {
    setIsOpenLogin(false);
    setIsOpenRegister(true);}
  const closeRegisterModal = () => setIsOpenRegister(false);

  const openLoginModal = () => {
    setIsOpenRegister(false);
    setIsOpenLogin(true);}
  const closeLoginModal = () => setIsOpenLogin(false);

  return (
    <ModalContext.Provider value={{ isOpenRegister, openRegisterModal, closeRegisterModal, isOpenLogin, openLoginModal, closeLoginModal }}>
      {children}
    </ModalContext.Provider>
  );
};
