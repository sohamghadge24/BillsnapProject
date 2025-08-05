// File: src/components/profile.tsx

import React, { useMemo } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Equal, UserCircle2, Link } from 'lucide-react';
import { Expense } from '../types/expense';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types/UserDetails';

interface ProfileProps {
  expenses: Expense[];
  monthlyIncome: number;
}

const Profile: React.FC<ProfileProps> = ({ expenses, monthlyIncome }) => {
  const { currentUser, currentUserDetails } = useAuth();

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const netProfit = monthlyIncome - totalExpenses;
  const profitStatus = netProfit > 0 ? 'profile' : netProfit < 0 ? 'loss' : 'even';

  const statusStyles = {
    profile: 'bg-green-400 text-green-800 border-green-300',
    loss: 'bg-red-400 text-red-800 border-red-300',
    even: 'bg-yellow-400 text-yellow-800 border-yellow-300',
  };

  const statusIcon = {
    profile: <TrendingUp className="h-5 w-5 text-green-600" />,
    loss: <TrendingDown className="h-5 w-5 text-red-600" />,
    even: <Equal className="h-5 w-5 text-yellow-600" />,
  };

  const profileDetails: UserProfile | undefined = currentUserDetails?.profile;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <DollarSign className="h-6 w-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Profile Summary</h2>
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-blue-50">
          <p className="text-gray-600 text-sm">Monthly Income</p>
          <p className="text-blue-800 text-lg font-bold">{formatCurrency(monthlyIncome)}</p>
        </div>
        <div className="p-4 border rounded-lg bg-red-50">
          <p className="text-gray-600 text-sm">Total Expenses</p>
          <p className="text-red-800 text-lg font-bold">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className={`p-4 border rounded-lg ${statusStyles[profitStatus]}`}>
          <p className="text-sm">Net {profitStatus === 'profile' ? 'Profit' : profitStatus === 'loss' ? 'Loss' : 'Balance'}</p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">
              {formatCurrency(Math.abs(netProfit))}
            </p>
            {statusIcon[profitStatus]}
          </div>
        </div>
      </div>

      {/* User Info */}
      {currentUser && currentUserDetails && (
        <div className="mt-8 border-t pt-6 space-y-6">
          <div className="flex items-center mb-4 space-x-3">
            <UserCircle2 className="h-6 w-6 text-gray-600" />
            <h3 className="text-xl font-semibold text-gray-800">User Info</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
            <div><span className="font-medium">UID:</span><div className="text-gray-900">{currentUser.uid}</div></div>
            <div><span className="font-medium">Email:</span><div className="text-gray-900">{currentUserDetails.email}</div></div>
            <div><span className="font-medium">Name:</span><div className="text-gray-900">{currentUserDetails.name}</div></div>
          </div>

          {/* Extended Profile Info */}
          {profileDetails && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700">
              <div><span className="font-medium">Username:</span><div className="text-gray-900">@{profileDetails.username}</div></div>
              <div><span className="font-medium">Phone:</span><div className="text-gray-900">{profileDetails.phone}</div></div>
              <div><span className="font-medium">Website:</span><a href={profileDetails.website} className="text-blue-600 hover:underline flex items-center" target="_blank" rel="noopener noreferrer"><Link className="h-4 w-4 mr-1" />{profileDetails.website}</a></div>
              <div><span className="font-medium">Role:</span><div className="text-gray-900">{profileDetails.role}</div></div>
              <div><span className="font-medium">Join Date:</span><div className="text-gray-900">{profileDetails.joinDate}</div></div>
              <div><span className="font-medium">Last Active:</span><div className="text-gray-900">{profileDetails.lastActive}</div></div>
              <div className="sm:col-span-2">
                <span className="font-medium">Bio:</span>
                <div className="text-gray-900">{profileDetails.bio}</div>
              </div>
              <div>
                <span className="font-medium">LinkedIn:</span>
                <a href={profileDetails.social.linkedin} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {profileDetails.social.linkedin}
                </a>
              </div>
              <div>
                <span className="font-medium">Twitter:</span>
                <a href={profileDetails.social.twitter} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  {profileDetails.social.twitter}
                </a>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Profile;
