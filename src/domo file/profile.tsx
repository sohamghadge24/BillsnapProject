// File: src/components/Profile.tsx

import React, { useMemo, useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Equal,
  UserCircle2,
  Link,
  Pencil,
  Save,
} from 'lucide-react';

import { Expense } from '../types/expense';
import { formatCurrency } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import { UserProfile } from '../types/UserDetails';

// Firebase
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

interface ProfileProps {
  expenses: Expense[];
}

const Profile: React.FC<ProfileProps> = ({ expenses }) => {
  const { currentUser, currentUserDetails } = useAuth();
  const profileDetails: UserProfile | undefined = currentUserDetails?.profile;

  const [isEditing, setIsEditing] = useState(false);

  const [editableProfile, setEditableProfile] = useState<UserProfile>({
    fullName: profileDetails?.fullName || '',
    username: profileDetails?.username || '',
    bio: profileDetails?.bio || '',
    phone: profileDetails?.phone || '',
    website: profileDetails?.website || '',
    social: {
      linkedin: profileDetails?.social?.linkedin || '',
      twitter: profileDetails?.social?.twitter || '',
    },
    joinDate: profileDetails?.joinDate || '',
    lastActive: profileDetails?.lastActive || '',
    role: profileDetails?.role || '',
    monthlyIncome: profileDetails?.monthlyIncome || 0,
  });

  const totalExpenses = useMemo(() => {
    return expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }, [expenses]);

  const netProfit = editableProfile.monthlyIncome - totalExpenses;
  const profitStatus = netProfit > 0 ? 'profit' : netProfit < 0 ? 'loss' : 'even';

  const statusStyles = {
    profit: 'bg-green-400 text-green-800 border-green-300',
    loss: 'bg-red-400 text-red-800 border-red-300',
    even: 'bg-yellow-400 text-yellow-800 border-yellow-300',
  };

  const statusIcon = {
    profit: <TrendingUp className="h-5 w-5 text-green-600" />,
    loss: <TrendingDown className="h-5 w-5 text-red-600" />,
    even: <Equal className="h-5 w-5 text-yellow-600" />,
  };

  const handleChange = (field: keyof UserProfile, value: any) => {
    setEditableProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (field: 'linkedin' | 'twitter', value: string) => {
    setEditableProfile((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    if (!currentUser || !currentUserDetails) return;

    try {
      const userDocRef = doc(db, 'User', currentUser.uid);
      await setDoc(
        userDocRef,
        {
          Email: currentUser.email,
          Name: currentUserDetails.name,
          profile: editableProfile,
          expenses: currentUserDetails.expenses || [],
        },
        { merge: true }
      );

      console.log('Profile saved!');
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg mt-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <DollarSign className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Profile Summary</h2>
        </div>
        <button
          className="flex items-center px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded"
          onClick={() => (isEditing ? handleSave() : setIsEditing(true))}
        >
          {isEditing ? <Save className="w-4 h-4 mr-1" /> : <Pencil className="w-4 h-4 mr-1" />}
          {isEditing ? 'Save' : 'Edit'}
        </button>
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 border rounded-lg bg-blue-50">
          <p className="text-gray-600 text-sm">Monthly Income</p>
          {isEditing ? (
            <input
              type="number"
              className="w-full border mt-1 p-1 rounded text-blue-800"
              value={editableProfile.monthlyIncome}
              onChange={(e) => handleChange('monthlyIncome', parseFloat(e.target.value))}
            />
          ) : (
            <p className="text-blue-800 text-lg font-bold">
              {formatCurrency(editableProfile.monthlyIncome)}
            </p>
          )}
        </div>
        <div className="p-4 border rounded-lg bg-red-50">
          <p className="text-gray-600 text-sm">Total Expenses</p>
          <p className="text-red-800 text-lg font-bold">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className={`p-4 border rounded-lg ${statusStyles[profitStatus]}`}>
          <p className="text-sm">
            Net {profitStatus === 'profit' ? 'Profit' : profitStatus === 'loss' ? 'Loss' : 'Balance'}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">{formatCurrency(Math.abs(netProfit))}</p>
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
            <div>
              <span className="font-medium">UID:</span>
              <div className="text-gray-900">{currentUser.uid}</div>
            </div>
            <div>
              <span className="font-medium">Email:</span>
              <div className="text-gray-900">{currentUserDetails.email}</div>
            </div>
            <div>
              <span className="font-medium">Full Name:</span>
              {isEditing ? (
                <input
                  value={editableProfile.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className="border p-1 w-full rounded mt-1"
                />
              ) : (
                <div className="text-gray-900">{editableProfile.fullName}</div>
              )}
            </div>
            <div>
              <span className="font-medium">Username:</span>
              {isEditing ? (
                <input
                  value={editableProfile.username}
                  onChange={(e) => handleChange('username', e.target.value)}
                  className="border p-1 w-full rounded mt-1"
                />
              ) : (
                <div className="text-gray-900">@{editableProfile.username}</div>
              )}
            </div>
            <div>
              <span className="font-medium">Phone:</span>
              {isEditing ? (
                <input
                  value={editableProfile.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className="border p-1 w-full rounded mt-1"
                />
              ) : (
                <div className="text-gray-900">{editableProfile.phone}</div>
              )}
            </div>
            <div>
              <span className="font-medium">Website:</span>
              {isEditing ? (
                <input
                  value={editableProfile.website}
                  onChange={(e) => handleChange('website', e.target.value)}
                  className="border p-1 w-full rounded mt-1"
                />
              ) : (
                <a
                  href={editableProfile.website}
                  className="text-blue-600 hover:underline flex items-center"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Link className="h-4 w-4 mr-1" />
                  {editableProfile.website}
                </a>
              )}
            </div>
            <div>
              <span className="font-medium">LinkedIn:</span>
              {isEditing ? (
                <input
                  value={editableProfile.social.linkedin}
                  onChange={(e) => handleSocialChange('linkedin', e.target.value)}
                  className="border p-1 w-full rounded mt-1"
                />
              ) : (
                <a
                  href={editableProfile.social.linkedin}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {editableProfile.social.linkedin}
                </a>
              )}
            </div>
            <div>
              <span className="font-medium">Twitter:</span>
              {isEditing ? (
                <input
                  value={editableProfile.social.twitter}
                  onChange={(e) => handleSocialChange('twitter', e.target.value)}
                  className="border p-1 w-full rounded mt-1"
                />
              ) : (
                <a
                  href={editableProfile.social.twitter}
                  className="text-blue-600 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {editableProfile.social.twitter}
                </a>
              )}
            </div>
            <div className="sm:col-span-2">
              <span className="font-medium">Bio:</span>
              {isEditing ? (
                <textarea
                  value={editableProfile.bio}
                  onChange={(e) => handleChange('bio', e.target.value)}
                  className="border p-1 w-full rounded mt-1"
                />
              ) : (
                <div className="text-gray-900">{editableProfile.bio}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
