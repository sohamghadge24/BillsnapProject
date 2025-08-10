// File: src/context/AuthContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserDetails, UserProfile } from '../types/UserDetails';

interface AuthContextType {
  currentUser: User | null;
  currentUserDetails: UserDetails | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentUserDetails, setCurrentUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user details from Firestore
  const fetchUserDetails = async (
    uid: string,
    setUserDetails: (data: UserDetails | null) => void
  ) => {
    try {
      const userDocRef = doc(db, 'User', uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();

        const profile: UserProfile | undefined = data.profile
  ? {
      fullName: data.profile.fullName || '',
      username: data.profile.username || '',
      bio: data.profile.bio || '',
      phone: data.profile.phone || '',
      website: data.profile.website || '',
      social: {
        linkedin: data.profile.social?.linkedin || '',
        twitter: data.profile.social?.twitter || '',
      },
      joinDate: data.profile.joinDate || '',
      lastActive: data.profile.lastActive || '',
      role: data.profile.role || '',
      monthlyIncome: data.profile.monthlyIncome || 0, // ← ADD THIS LINE
    }
  : undefined;


        const userDetails: UserDetails = {
          name: data.Name || data.name || '',
          email: data.Email || data.email || '',
          uid,
          expenses: data.expenses || [],
          profile,
        };

        console.log('[AuthProvider] Fetched user data:', userDetails);
        setUserDetails(userDetails);
      } else {
        console.warn('[AuthProvider] No user profile in Firestore for UID: ${uid}');
        setUserDetails(null);
      }
    } catch (error) {
      console.error('[AuthProvider] Error fetching user details:', error);
      setUserDetails(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user);
      await fetchUserDetails(result.user.uid, setCurrentUserDetails);
      return true;
    } catch (error) {
      console.error('[AuthProvider] Login failed:', error);
      return false;
    }
  };

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user);

      const defaultProfile: UserProfile = {
        fullName: '',
        username: '',
        bio: '',
        phone: '',
        website: '',
        social: {
          linkedin: '',
          twitter: '',
        },
        joinDate: new Date().toLocaleDateString(),
        lastActive: new Date().toLocaleTimeString(),
        role: 'User',
        monthlyIncome: 0,
      };

      const newUserDetails: UserDetails = {
        name: '',
        email: result.user.email || '',
        uid: result.user.uid,
        expenses: [],
        profile: defaultProfile,
      };

      const userDocRef = doc(db, 'User', result.user.uid);
      await setDoc(userDocRef, newUserDetails);
      setCurrentUserDetails(newUserDetails);

      return true;
    } catch (error) {
      console.error('[AuthProvider] Signup failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setCurrentUserDetails(null);
    } catch (error) {
      console.error('[AuthProvider] Logout failed:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserDetails(user.uid, setCurrentUserDetails);
      } else {
        setCurrentUserDetails(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{ currentUser, currentUserDetails, loading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
