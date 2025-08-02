// AuthPage.tsx
import React, { useState } from 'react';
import { AuthForm } from '../components/AuthForm';
import { useAuth } from '../context/AuthContext'; // Adjust path as needed

export const AuthPage: React.FC = () => {
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const success = await login(email, password);
      if (!success) {
        setError('Invalid email or password');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string) => {
    setError('Sign up not implemented. Ask your admin.');
    
  };

  return (
    <AuthForm
      onSignIn={handleSignIn}
      onSignUp={handleSignUp}
      loading={loading}
      error={error}
    />
  );
};
