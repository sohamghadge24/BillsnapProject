import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { currentUser, currentUserDetails } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">User Profile</h1>

      {currentUser && currentUserDetails ? (
        <div>
          <p><strong>UID:</strong> {currentUser.uid}</p>
          <p><strong>Email:</strong> {currentUserDetails.email}</p>
          <p><strong>Name:</strong> {currentUserDetails.name}</p>
        </div>
      ) : (
        <p className="text-gray-500">User not logged in or loading data...</p>
      )}
    </div>
  );
};

export default Profile;
