import React, { useState, useEffect } from 'react';
import { Dashboard } from './components/Dashboard';
import { ExpenseList } from './components/ExpenseList';
import { Scanner } from './components/Scanner';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';
import { AddExpenseModal } from './components/AddExpenseModal';
import { AuthForm } from './components/AuthForm';
import { Expense } from './types/expense';
import { FirebaseService } from './services/firebaseService';
import { useAuth } from './context/AuthContext';

export type View = 'dashboard' | 'expenses' | 'scanner' | 'reports';

function App() {
  const {
    currentUser,
    currentUserDetails,
    loading,
    login,
    logout,
  } = useAuth();

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expensesLoading, setExpensesLoading] = useState(false);

  useEffect(() => {
    let unsubscribe: () => void;

    if (currentUser) {
      setExpensesLoading(true);
      unsubscribe = FirebaseService.subscribeToExpenses(currentUser.uid, (updatedExpenses) => {
        setExpenses(updatedExpenses);
        setExpensesLoading(false);
      });
    } else {
      setExpenses([]);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [currentUser]);

  const addExpense = async (expense: Omit<Expense, 'id'>) => {
    if (!currentUser) return;

    try {
      await FirebaseService.addExpense(currentUser.uid, expense);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await FirebaseService.deleteExpense(id);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const updateExpense = async (id: string, updates: Partial<Expense>) => {
    try {
      await FirebaseService.updateExpense(id, updates);
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  // Show auth form if not logged in and not loading
  if (!currentUser && !loading) {
    return (
      <AuthForm
        onSignIn={login}
        onSignUp={login} // replace with `signUp` if you separate login/signup logic
        loading={loading}
        error={null}
      />
    );
  }

  // Show loading spinner
  if (loading || !currentUserDetails) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Render selected view
  const renderCurrentView = () => {
    if (expensesLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading expenses...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard expenses={expenses} />;
      case 'expenses':
        return (
          <ExpenseList
            expenses={expenses}
            onDeleteExpense={deleteExpense}
            onUpdateExpense={updateExpense}
          />
        );
      case 'scanner':
        return <Scanner onAddExpense={addExpense} />;
      case 'reports':
        return <Reports expenses={expenses} />;
      default:
        return <Dashboard expenses={expenses} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddExpense={() => setIsAddModalOpen(true)}
        onLogout={logout}
        userEmail={currentUserDetails.email}
      />

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {renderCurrentView()}
      </main>

      <AddExpenseModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddExpense={addExpense}
      />
    </div>
  );
}

export default App;

