'use client';

import React from 'react';
import { IoMdClose } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from '../ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { signIn } from 'next-auth/react';
import { toast } from "react-hot-toast";
import { Label } from '../ui/label';

import { useModal } from './ModalContext';

type FormFields = {
    email: string;
    password: string;
  };

const LoginModal = () => {

    const { 
        register, 
        handleSubmit, 
        formState: { errors } 
      } = useForm<FormFields>();

    const { isOpenLogin, closeLoginModal, openRegisterModal } = useModal();


    const onClose = () => { 
        closeLoginModal();
      }

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
      try {
        const result = await signIn('credentials', {
          redirect: false,
          email: data.email,
          password: data.password,
        });
    
        if (result?.error) {
          toast.error(`Login failed`);
          // Display error message to the user, e.g., set an error state and show it in the UI
        } else {
          toast.success('Login successful');
          // Optionally close the modal or redirect the user after successful login
          closeLoginModal();
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        // Handle unexpected errors, e.g., set an error state and show it in the UI
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
            />
            {errors.password && (
              <div className='text-sm text-red-700'>
                {errors.password.message}
              </div>
            )}
          </div>
          <Button type='submit'>Login Now</Button>
          <div className='font-semibold'>
              <h2>
                Doesn&apos;t have an account?{' '}
                <span
                  onClick={() => {
                    closeLoginModal();
                    openRegisterModal();
                  }}
                  className="text-blue-600 cursor-pointer hover:underline"
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

export default LoginModal