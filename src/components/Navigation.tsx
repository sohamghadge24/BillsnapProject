// File: src/components/Navigation.tsx

import React from 'react';
import { View } from '../App';
import {
  LayoutDashboard,
  Receipt,
  Scan,
  FileText,
  Plus,
  LogOut,
  User,
  PiggyBank,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAddExpense: () => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onAddExpense,
  onLogout,
}) => {
  const { currentUserDetails } = useAuth();

  const navItems: { id: View; label: string; icon: React.ElementType }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'scanner', label: 'Scanner', icon: Scan },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'Budget', label: 'Budget', icon: PiggyBank },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Receipt className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">ExpenseTracker</h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navItems.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => onViewChange(id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                    currentView === id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onAddExpense}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>

            <button
              onClick={() => onViewChange('profile')}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-blue-600 transition-colors"
              title="View Profile"
            >
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">
                {currentUserDetails?.profile?.fullName || 'User'}
              </span>
            </button>

            <button
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden border-t border-gray-200 pt-2 pb-4">
          <div className="flex space-x-1 overflow-x-auto">
            {navItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg font-medium transition-colors min-w-0 ${
                  currentView === id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};


