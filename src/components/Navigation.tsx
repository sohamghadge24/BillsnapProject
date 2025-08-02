import React from 'react';
import { View } from '../App';
import { User } from 'lucide-react';
import { 
  LayoutDashboard, 
  Receipt, 
  Scan, 
  FileText, 
  Plus,
  LogOut
} from 'lucide-react';
import { uid } from 'chart.js/helpers';
import { UserDetails } from '../types/UserDetails';
import { useAuth } from '../context/AuthContext';
import { auth } from '../config/firebase';

interface NavigationProps {
  currentView: View;
  onViewChange: (view: View) => void;
  onAddExpense: () => void;
  onLogout: () => void;
  // userEmail?: string;
  // userName?:string;
  // UserDetails?:string;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  onViewChange,
  onAddExpense,
  onLogout,
 
  // userName
}) => {
  const { currentUser: UserDetails } = useAuth();
  const navItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'expenses' as View, label: 'Expenses', icon: Receipt },
    { id: 'scanner' as View, label: 'Scanner', icon: Scan },
    { id: 'reports' as View, label: 'Reports', icon: FileText }
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <Receipt className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">ExpenseTracker</h1>
            </div>
            
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onViewChange(item.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      currentView === item.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={onAddExpense}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Expense</span>
            </button>

            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              {/* <span className="hidden sm:inline">{}</span> */}
              <span className="hidden sm:inline">{auth.currentUser?.email}</span>
              
            </div>

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
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg font-medium transition-colors min-w-0 ${
                    currentView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};