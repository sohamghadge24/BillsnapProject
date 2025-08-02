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
  signOut,
  User,
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { UserDetails } from '../types/UserDetails';

interface AuthContextType {
  currentUser: User | null;
  currentUserDetails: UserDetails | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
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

  const fetchUserDetails = async (
    uid: string,
    setUserDetails: (data: UserDetails | null) => void
  ) => {
    try {
      const userDocRef = doc(db, 'User', uid);
      const userSnap = await getDoc(userDocRef);

      if (userSnap.exists()) {
        const data = userSnap.data();
        console.log('Fetched user data from Firestore:', data);

        const userDetails: UserDetails = {
          name: data.Name || data.name || '',
          email: data.Email || data.email || '',
          uid: data.uid || uid,
          expenses: data.expenses || [],
        };

        setUserDetails(userDetails);
      } else {
        console.warn(`User profile not found for UID: ${uid}`);
        setUserDetails(null);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
      setUserDetails(null);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      setCurrentUser(result.user);
      console.log(result.user.uid);
      await fetchUserDetails( result.user.uid ,setCurrentUserDetails);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setCurrentUserDetails(null);
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
      value={{ currentUser, currentUserDetails, loading, login, logout }}
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