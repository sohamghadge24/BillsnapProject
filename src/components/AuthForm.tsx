// File: src/components/AuthForm.tsx
import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

interface AuthFormProps {
  onSignIn: (email: string, password: string) => void;
  onSignUp: (email: string, password: string) => void;
  loading: boolean;
  error: string | null;
}

export const AuthForm: React.FC<AuthFormProps> = ({
  onSignIn,
  onSignUp,
  loading,
  error,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    onSignIn(email, password);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    onSignUp(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md transition-all duration-300">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-800">
          Welcome
        </h2>

        {error && <p className="text-red-600 text-sm text-center mb-4">{error}</p>}

        <form className="space-y-5">
          <div className="relative">
            <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="email"
              placeholder="Email"
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="pl-10 pr-10 py-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700 transition"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSignIn}
              disabled={loading}
              className="w-1/2 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Sign In'}
            </button>

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="w-1/2 py-2 px-4 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Register'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
