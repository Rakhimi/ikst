'use client';

import React, { useCallback, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from '../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from "react-hot-toast";
import { useModal } from './ModalContext';
import { Label } from '../ui/label';
import { signIn } from 'next-auth/react';
import { useRouter } from "next/navigation";


type FormFields = {
  email: string;
  password: string;
  confirmPassword: string;
};

const RegisterModal = () => {


  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<FormFields>();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { isOpenRegister, isOpenLogin, closeRegisterModal, openLoginModal } = useModal();

  const onClose = () => { 
    if (isLoading) return;
    closeRegisterModal();
  };

  const onToggle = useCallback(() => {
    closeRegisterModal();
    openLoginModal();
  }, [isOpenLogin, isOpenRegister])

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setIsLoading(true); // Set loading state to true on submission

    const { confirmPassword, ...submitData } = data; // Exclude confirmPassword
    console.log(confirmPassword)
    console.log(submitData);
  
    try {
      // Send registration data to the server
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData), // Send only email and password
      });
  
      // Check if the response is OK
      if (!response.ok) {
        const errorResponse = await response.json();
        toast.error(`Registration failed: ${errorResponse.error || 'Unknown error'}`);
        throw new Error('Registration failed');
      }
      await response.json();
  
      // Sign in the user
      const signInResponse = await signIn('credentials', {
        redirect: false,
        email: submitData.email,
        password: submitData.password,
      });

  
      if (signInResponse?.error) {
        toast.error(`Sign-in failed: ${signInResponse.error}`);
        throw new Error('Sign-in failed');
      }
  
      // Notify success and close the modal
      toast.success('Registration successful');
      router.refresh();
      closeRegisterModal();
  
    } catch (error) {
      console.error('Error during registration:', error);
    } finally {
      setIsLoading(false); // Set loading state back to false after submission
    }
  };
  
  // Watch the values of password and confirmPassword
  const password = watch("password", "");

  const body = (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className='flex flex-col gap-4'
    >
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          placeholder='Email'
          {...register('email', { required: 'Email is required' })}
          type='email'
          disabled={isLoading} 
        />
        {errors.email && (
          <div className='text-sm text-red-700'>
            {errors.email.message}
          </div>
        )}
      </div>
      
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          placeholder='Password'
          {...register('password', 
          { 
            required: 'Password is required',
            minLength: {
              value: 8,
              message: 'Password must have at least 8 characters',
            }
          })}
          type='password'
          disabled={isLoading} 
        />
        {errors.password && (
          <div className='text-sm text-red-700'>
            {errors.password.message}
          </div>
        )}
      </div>

      <div>
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          placeholder='Confirm Password'
          {...register('confirmPassword', {
            required: 'Confirm password is required',
            validate: (value) =>
              value === password || 'Passwords do not match',
          })}
          type='password'
          disabled={isLoading} 
        />
        {errors.confirmPassword && (
          <div className='text-sm text-red-700'>
            {errors.confirmPassword.message}
          </div>
        )}
      </div>

      <Button type='submit' disabled={isLoading}> 
        {isLoading ? 'Registering...' : 'Register Now'}
      </Button>

      <div className='font-semibold'>
              <h2>
                Already have an account?{' '}
                <span
                onClick={isLoading ? undefined : onToggle} // Disable toggle when loading
                className={`text-blue-600 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
              >
                Sign in now
              </span>
              </h2>
        </div>
    </form>
  );

  if (!isOpenRegister) return null;

  return (
    <div
        className='
        justify-center 
        items-center 
        flex 
        overflow-x-hidden 
        overflow-y-auto 
        fixed 
        inset-0 
        z-50
        outline-none 
        focus:outline-none
        bg-neutral-800/70
        '
    >
      <div 
        className='
          relative 
          w-full
          md:w-4/6
          lg:w-3/6
          xl:w-2/5
          my-6
          mx-auto 
          h-full 
          lg:h-auto
          md:h-auto'
      >
        <div className={`
            translate
            duration-300
            h-full
            ${isOpenRegister ? 'translate-y-0' : 'translate-y-full'}
            ${isOpenRegister ? 'opacity-100' : 'opacity-0'}
        `}>
          <div className='
            translate
            h-full
            lg:h-auto
            md:h-auto
            border-0 
            rounded-lg 
            shadow-lg 
            relative 
            flex 
            flex-col 
            w-full 
            bg-white 
            outline-none 
            focus:outline-none'
          >
            <div className='
              flex 
              items-center 
              p-6
              rounded-t
              justify-center
              relative
              border-b-[1px]
            '>
              <button
                className="
                  p-1
                  border-0 
                  hover:opacity-70
                  transition
                  absolute
                  left-9
                "
                onClick={onClose}
              >
                <IoMdClose size={18} />
              </button>
            </div>
            <div className="text-lg font-semibold px-4">
              {'Register your account here'}
            </div>
            <div className="relative p-6 flex-auto">
              {body}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterModal;
