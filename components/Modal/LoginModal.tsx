'use client';

import React, { useCallback, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from '../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from "react-hot-toast";
import { Label } from '../ui/label';
import { useRouter } from "next/navigation";

import { useModal } from './ModalContext';

type FormFields = {
  email: string;
  password: string;
};

const LoginModal = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<FormFields>();

  const { isOpenLogin, isOpenRegister, closeLoginModal, openRegisterModal } = useModal();

  const onToggle = useCallback(() => {
    closeLoginModal();
    openRegisterModal();
  }, [isOpenLogin, isOpenRegister]);

  const onClose = () => { 
    if (isLoading) return;
    closeLoginModal();
  };

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    setIsLoading(true); // Set loading state to true on submission

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error) {
        toast.error(`Login failed`);
      } else {
        toast.success('Login successful');
        router.refresh();
        closeLoginModal();
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('Unexpected error occurred.');
    } finally {
      setIsLoading(false); // Set loading state back to false after submission
    }
  };

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
          disabled={isLoading} // Disable input when loading
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
          disabled={isLoading} // Disable input when loading
        />
        {errors.password && (
          <div className='text-sm text-red-700'>
            {errors.password.message}
          </div>
        )}
      </div>
      <Button type='submit' disabled={isLoading}> 
        {isLoading ? 'Signing in...' : 'Sign in'}
      </Button>
      <div className='font-semibold'>
        <h2>
          Doesn&apos;t have an account?{' '}
          <span
            onClick={isLoading ? undefined : onToggle} // Disable toggle when loading
            className={`text-blue-600 cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:underline'}`}
          >
            Register now
          </span>
        </h2>
      </div>
    </form>
  );

  if (!isOpenLogin) return null;

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
          ${isOpenLogin ? 'translate-y-0' : 'translate-y-full'}
          ${isOpenLogin ? 'opacity-100' : 'opacity-0'}
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
                className={` 
                  p-1
                  border-0 
                  hover:opacity-70
                  transition
                  absolute
                  left-9
                  ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                onClick={onClose}
                disabled={isLoading} // Disable close button when loading
              >
                <IoMdClose size={18} />
              </button>
            </div>
            <div className="text-lg font-semibold px-4">
              {'Sign in'}
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

export default LoginModal;
