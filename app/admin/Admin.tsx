'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from "axios";
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  school: string;
  grade: string;
  userId: number;
  code: string;
}

interface Listings {
  createdAt: string;
  profiles: Profile[];
  id: number;
  email: string;
  hashedPassword: string;
  updatedAt: string; 
}

interface AdminProps {
  listings: Listings[];
}

const Admin: React.FC<AdminProps> = ({ listings }) => {
  // Flatten profiles array from listings for easier management
  const [profiles, setProfiles] = useState<Profile[]>(listings.flatMap(listing => listing.profiles));

  const router = useRouter();

  const deleteProfile = async (id: number) => {
    try {
      const response = await axios.delete(`/api/deleteListing/${id}`);
  
      if (response.status === 200) {
        const result = response.data;
  
        if (result.success) {
          // Update the profiles list after successful deletion
          toast.success('Registration deleted');
          router.refresh();
          setProfiles((prevProfiles) => prevProfiles.filter(profile => profile.id !== id));
        } else {
          toast.error('Failed to delete');
          console.error(result.error || 'Failed to delete the profile');
        }
      } else {
        toast.error('Failed to delete the registration');
        console.error('Failed to delete the profile');
      }
    } catch (error) {
      console.error('An error occurred while deleting the profile', error);
    }
  };

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-bold mb-4'>Admin Dashboard</h1>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>First name</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Last name</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>School</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Grade</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Code</th>
            <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
        {profiles.map(profile => (
            <tr key={profile.id}>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                {listings.find(listing => listing.profiles.some(p => p.id === profile.id))?.email || 'Unknown'}
              </td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{profile.id}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{profile.firstName}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{profile.lastName}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{profile.school}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{profile.grade}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{profile.code}</td>
                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-red-500 text-white font-semibold hover:bg-red-600">
                    Delete
                </Button>
              </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete your registration
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteProfile(profile.id)}>Continue</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>  
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  );
};

export default Admin;
