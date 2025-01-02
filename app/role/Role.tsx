'use client';

import React, { useState } from 'react';
import { UserRole } from '@prisma/client';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface User {
  id: number;
  email: string;
  hashedPassword: string;
  createdAt: Date;
  updatedAt: Date;
  role: UserRole;
}

interface RoleProps {
  users: User[];
}

const Role: React.FC<RoleProps> = ({ users }) => {

  const [userList, setUserList] = useState(users);

  const handleRoleChange = async (index: number, newRole: UserRole, userId: number) => {

    const updatedUserList = [...userList];
    updatedUserList[index].role = newRole;
    setUserList(updatedUserList);

    try {
      await axios.post('/api/update-role', {
        id: userId,
        role: newRole,
      });

      // Handle the successful response if necessary
      toast.success('Role updated successfully');
    } catch (error) {
      // Handle errors if any
      console.error('Error updating role:', error);
      toast.error('Role updated unsuccessfully');
    }
  };

  return (
    <div className="my-20">
      <table className="w-1/2 divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Email
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Role
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.id}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                <Select
                  value={user.role}
                  onValueChange={(value) => handleRoleChange(index, value as UserRole, user.id)}
                >
                  <SelectTrigger className="w-[180px] border border-gray-400">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
                    <SelectItem value={UserRole.USER}>Parent/Teacher</SelectItem>
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Role;
