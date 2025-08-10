// File: src/types/UserDetails.ts

export interface UserDetails {
  name: UserProfile['fullName'];
  email: string;
  uid: string;
  expenses?: any[]; 
  profile?: UserProfile;// Replace with a proper Expense[] if available
}

export interface UserProfile {
  fullName: string;
  username: string;
  bio: string;
  phone: string;
  website: string;
  social: {
    linkedin: string;
    twitter: string;
  };
  joinDate: string;
  lastActive: string;
  role: string;
  monthlyIncome: number; // ✅ no question mark here
}
