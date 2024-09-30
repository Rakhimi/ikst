'use client';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import axios from "axios";

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
} from "@/components/ui/alert-dialog"

// Define the Profile and Listing types for better type safety
interface Profile {
  id: number;
  firstName: string;
  lastName: string;
  school: string;
  grade: string;
  code: string;
}

interface Listing {
  profiles: Profile[];
}

interface DashboardProps {
  listing: Listing | null;
}

const Dashboard: React.FC<DashboardProps> = ({ listing }) => {
  const [profiles, setProfiles] = useState<Listing['profiles']>(listing?.profiles || []);
  const router = useRouter();

  const addStudent = () => { 
    router.push('/registerExam');
  };

  const deleteProfile = async (id: number) => {
    try {
      const response = await axios.delete(`/api/deleteListing/${id}`);

      console.log('Response:', response.data);

      if (response.status === 200) {
        const result = response.data;

        if (result.success) {
          // Update the profiles list after successful deletion
          toast.success('Registration deleted');
          router.refresh();
          setProfiles(profiles.filter(profile => profile.id !== id));
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

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Registered Student</h1>
          <Button onClick={addStudent}>Register Now</Button>
        </div>
      </div>
    );
  }

  if (profiles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">No Registered Student</h1>
          <Button onClick={addStudent}>Register Now</Button>
        </div>
      </div>
    );
  }

  return (<div className="w-full p-6">
    <div className='flex justify-between'>
      <h1 className="text-2xl font-bold mb-4">Your Registered Students</h1>
      <div>
        <Button onClick={addStudent}>Add Student</Button>
      </div>
    </div>
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile ID</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">First Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Name</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {profiles.map((profile) => (
          <tr key={profile.id}>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.id}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.firstName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.lastName}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.school}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.grade}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{profile.code}</td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
        ))}
      </tbody>
    </table>
  </div>)
};

export default Dashboard;
