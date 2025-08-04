//profit.tsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircle2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { currentUser, currentUserDetails } = useAuth();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <div className="flex items-center mb-6 space-x-4">
        <UserCircle2 className="h-12 w-12 text-blue-600" />
        <h1 className="text-2xl font-semibold text-gray-800">User Profile</h1>
      </div>

      {currentUser && currentUserDetails ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">UID:</span>
            <span className="text-gray-900 break-all text-right">{currentUser.uid}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Email:</span>
            <span className="text-gray-900">{currentUserDetails.email}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Name:</span>
            <span className="text-gray-900">{currentUserDetails.name}</span>
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center">
          User not logged in or loading data...
        </p>
      )}
    </div>
  );
};

export default Profile;

