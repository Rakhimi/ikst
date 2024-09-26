'use client'

import React, { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { verifySecret } from "@/lib/verifySecret";
import axios from 'axios';
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useModal } from "@/components/Modal/ModalContext";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaCircleCheck } from "react-icons/fa6";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardDescription,
    CardTitle,
  } from "@/components/ui/card";

type VerifyFields = {
    
    email:string;
    maiden: string;
    sport: string;
    color: string;
};

type UpdateFields = {
    password: string;
    confirmPassword: string;
}

const PasswordReset = () => {

    const {
    register: registerVerify,
    handleSubmit: handleSubmitVerify,
    setError: setErrorVerify,
    formState: { errors: verifyErrors },
  } = useForm<VerifyFields>();

  // Form for updating password
  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    watch: watchPassword,
    formState: { errors: passwordErrors },
  } = useForm<UpdateFields>();

  const { openLoginModal } = useModal();


    const [isLoading, setIsLoading] = useState(false);
    const [isVerified, setIsVerified] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [verificationId, setVerificationId] = useState<number | null>(null);
    const router = useRouter();

    const password = watchPassword("password", "");

    // Handle form submission for verifying the secret answers
    const handleVerifySecret: SubmitHandler<VerifyFields> = async (data) => {
        setIsLoading(true);
        try {
            // Call verifySecret with the required data
            const result = await verifySecret(data.email, data.maiden, data.sport, data.color);
            console.log(result);
    
            // Check if the verification was successful
            if (result.userId) {
                // Verification successful
                setIsVerified(true);
                setVerificationId(result.userId); // Assuming `setVerificationId` takes a user ID
                toast.success('Verified. Please update your password');
            } else if (result.errors) {
                // Verification failed, set errors
                if (result.errors.email) setErrorVerify("email", { message: result.errors.email });
                if (result.errors.maiden) setErrorVerify("maiden", { message: result.errors.maiden });
                if (result.errors.sport) setErrorVerify("sport", { message: result.errors.sport });
                if (result.errors.color) setErrorVerify("color", { message: result.errors.color });
            } else {
                // Handle unexpected result
                toast.error('An unexpected error occurred');
            }
        } catch (error) {
            console.error("Error during verification:", error);
            toast.error('Error during verification');
        } finally {
            setIsLoading(false);
        }
    };
    

    // Handle form submission for resetting the password
    const handleResetPassword: SubmitHandler<UpdateFields> = async (data) => {
        if (!isVerified) {
            toast.error("Please verify your secret answers before resetting the password.");
            return;
        }
        setIsLoading(true);

        const { confirmPassword,...submittedData } = data;
        console.log(confirmPassword);

        try {

          const response = await axios.post('/api/update-password',{ ...submittedData, id: verificationId });

          if (response.status !== 200) {
            toast.error(`Update failed: ${response.data.error || 'Unknown error'}`);
            throw new Error('Update failed');
          }

          setIsUpdated(true);
          toast.success('Password successfully updated!');
          
          setTimeout(() => {
            router.push('/');
            openLoginModal();
          }, 3000);

        } catch (error) {
         
          toast.error(`Error during password update`);
          console.error('Error:', error);
      
        } finally {
          setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center gap-5">
            {/* Secret Questions Form */}
            <form className="w-1/3 mt-10" onSubmit={handleSubmitVerify(handleVerifySecret)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">
                        <div className="flex justify-between">
                          <div>Secret Questions</div>
                          {isVerified && (
                            <div>
                              <FaCircleCheck className="text-green-600"/>
                            </div>
                          )}
                        </div>
                        </CardTitle>
                        <CardDescription>Answer these questions so we can reset your password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label className="font-semibold" htmlFor="email">Your email</Label>
                                <Input
                                    placeholder='Email'
                                    {...registerVerify('email', { required: 'This is required' })}
                                    type='text'
                                    disabled={isLoading || isVerified}
                                    className="hover:border-gray-700"
                                />
                                {verifyErrors.email && <div className="text-sm text-red-700">{verifyErrors.email.message}</div>}
                            </div>
                            <div>
                                <Label className="font-semibold" htmlFor="motherMaidenName">Mother&apos;s Maiden Name</Label>
                                <Input
                                    placeholder='Mother Maiden Name'
                                    {...registerVerify('maiden', { required: 'This is required' })}
                                    type='text'
                                    disabled={isLoading || isVerified}
                                    className="hover:border-gray-700"
                                />
                                {verifyErrors.maiden && <div className="text-sm text-red-700">{verifyErrors.maiden.message}</div>}
                            </div>
                            <div>
                                <Label className="font-semibold" htmlFor="favoriteSport">Favorite Sport</Label>
                                <Input
                                    placeholder='Favorite Sport'
                                    {...registerVerify('sport', { required: 'This is required' })}
                                    type='text'
                                    disabled={isLoading || isVerified}
                                    className="hover:border-gray-700"
                                />
                                {verifyErrors.sport && <div className="text-sm text-red-700">{verifyErrors.sport.message}</div>}
                            </div>
                            <div>
                                <Label className="font-semibold" htmlFor="favoriteColor">Favorite Color</Label>
                                <Input
                                    placeholder='Favorite Color'
                                    {...registerVerify('color', { required: 'This is required' })}
                                    type='text'
                                    disabled={isLoading || isVerified}
                                    className="hover:border-gray-700"
                                />
                                {verifyErrors.color && <div className="text-sm text-red-700">{verifyErrors.color.message}</div>}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isLoading || isVerified}>
                            {isLoading ? 'Verifying...' : 'Verify'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>

            {/* Password Reset Form */}
            <form className="w-1/3 mt-10" onSubmit={handleSubmitPassword(handleResetPassword)}>
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Reset Password</CardTitle>
                        <CardDescription>Enter your new password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col gap-4">
                            <div>
                                <Label className="font-semibold" htmlFor="password">New Password</Label>
                                <Input
                                    placeholder='Password'
                                    {...registerPassword('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 8,
                                            message: 'Password must have at least 8 characters',
                                        }
                                    })}
                                    type='password'
                                    disabled={isLoading || !isVerified || isUpdated}
                                    className="hover:border-gray-700"
                                />
                                {passwordErrors.password && (
                                    <div className="text-sm text-red-700">
                                        {passwordErrors.password.message}
                                    </div>
                                )}
                            </div>
                            <div>
                                <Label className="font-semibold" htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    placeholder='Confirm Password'
                                    {...registerPassword('confirmPassword', {
                                        required: 'Confirm password is required',
                                        validate: (value) => value === password || 'Passwords do not match',
                                    })}
                                    type='password'
                                    disabled={isLoading || !isVerified || isUpdated}
                                    className="hover:border-gray-700"
                                />
                                {passwordErrors.confirmPassword && (
                                    <div className="text-sm text-red-700">
                                        {passwordErrors.confirmPassword.message}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type='submit' disabled={isLoading || !isVerified || isUpdated}>
                            {isLoading ? 'Resetting...' : 'Reset'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
};

export default PasswordReset;
