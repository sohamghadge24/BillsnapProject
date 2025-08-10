// File: src/pages/ProfileQuestionsPage.tsx
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { UserProfile } from '../types/UserDetails';
import { useAuth } from '../context/AuthContext';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

export const ProfileQuestionsPage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { currentUser } = useAuth();

  const [profileData, setProfileData] = useState<UserProfile>({
    fullName: '',
    username: '',
    bio: '',
    phone: '',
    website: '',
    social: {
      linkedin: '',
      twitter: '',
    },
    joinDate: new Date().toISOString(),
    lastActive: new Date().toISOString(),
    role: '',
    monthlyIncome: 0,
  });

  const handleChange = (field: keyof UserProfile, value: any) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSocialChange = (field: 'linkedin' | 'twitter', value: string) => {
    setProfileData((prev) => ({
      ...prev,
      social: {
        ...prev.social,
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
  if (!currentUser) return;

  try {
    const userDocRef = doc(db, 'User', currentUser.uid);
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      await updateDoc(userDocRef, { profile: profileData });
    } else {
      await setDoc(userDocRef, { profile: profileData });
    }

    onComplete();
  } catch (error) {
    console.error('Error saving profile:', error);
  }
};

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4">Complete Your Profile</h2>

      <div className="space-y-4">
        <input
          placeholder="Full Name"
          className="border p-2 w-full rounded"
          value={profileData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
        />
        <input
          placeholder="Username"
          className="border p-2 w-full rounded"
          value={profileData.username}
          onChange={(e) => handleChange('username', e.target.value)}
        />
        <textarea
          placeholder="Bio"
          className="border p-2 w-full rounded"
          value={profileData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
        />
        <input
          placeholder="Phone"
          className="border p-2 w-full rounded"
          value={profileData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
        />
        <input
          placeholder="Website"
          className="border p-2 w-full rounded"
          value={profileData.website}
          onChange={(e) => handleChange('website', e.target.value)}
        />
        <input
          placeholder="LinkedIn URL"
          className="border p-2 w-full rounded"
          value={profileData.social.linkedin}
          onChange={(e) => handleSocialChange('linkedin', e.target.value)}
        />
        <input
          placeholder="Twitter URL"
          className="border p-2 w-full rounded"
          value={profileData.social.twitter}
          onChange={(e) => handleSocialChange('twitter', e.target.value)}
        />
        <input
          placeholder="Role"
          className="border p-2 w-full rounded"
          value={profileData.role}
          onChange={(e) => handleChange('role', e.target.value)}
        />
        <input
          type="number"
          placeholder="Monthly Income"
          className="border p-2 w-full rounded"
          value={profileData.monthlyIncome}
          onChange={(e) => handleChange('monthlyIncome', parseFloat(e.target.value) || 0)}
        />
      </div>

      <button
        onClick={handleSave}
        className="mt-6 w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
      >
        <Save className="w-4 h-4 mr-2" /> Save Profile
      </button>
    </div>
  );
};
