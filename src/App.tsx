import React, { useState, useEffect } from 'react';
import { Header } from './components/public/headerPage';
import { Footer } from './components/public/footerPage';
import { HomePage } from './components/public/HomePage';
import { AboutPage } from './components/public/Aboutpage';
import { PricingPage } from './components/public/PricePage';
import { ContactPage } from './components/public/ContactPage';
import { LoginPage } from './components/Auth/Login';
import { RegisterPage } from './components/Auth/Register';
import { Dashboard } from './components/Dashboard';
import { ExpenseList } from './components/ExpenseList';
import { Scanner } from './components/Scanner';
import { Reports } from './components/Reports';
import { Navigation } from './components/Navigation';
import { AddExpenseModal } from './components/AddExpenseModal';
import { Expense } from './types/expense';
import { FirebaseService } from './services/firebaseService';
import { useAuth } from './context/AuthContext';
import { PublicView, AppView } from './types/navigation';
import { Budget } from './components/Budget';
import Profile from './domo file/profile';
import { ProfileQuestionsPage } from './components/ProfileQuestionsPage';

function App() {
  const { currentUser, loading, login, signup, logout } = useAuth();
  const [currentPublicView, setCurrentPublicView] = useState<PublicView>('home');
  const [currentAppView, setCurrentAppView] = useState<AppView>('dashboard');
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [expensesLoading, setExpensesLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setExpensesLoading(true);
      const unsubscribe = FirebaseService.subscribeToExpenses(currentUser.uid, (updatedExpenses) => {
        setExpenses(updatedExpenses);
        setExpensesLoading(false);
      });
      return () => unsubscribe();
    } else {
      setExpenses([]);
    }
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

  if (!currentUser && !loading) {
    const renderPublicView = () => {
      switch (currentPublicView) {
        case 'home':
          return <HomePage onViewChange={setCurrentPublicView} />;
        case 'about':
          return <AboutPage />;
        case 'pricing':
          return <PricingPage onViewChange={setCurrentPublicView} />;
        case 'contact':
          return <ContactPage />;
        case 'login':
          return (
            <LoginPage
              onLogin={login}
              onViewChange={setCurrentPublicView}
              loading={loading}
              error={null}
            />
          );
        case 'register':
          return (
            <RegisterPage
              onRegister={signup}
              onViewChange={(view) => {
                // if registration is done, send them to profileQuestions in AppView
                if (view === 'profileQuestions') {
                  setCurrentAppView('profileQuestions');
                } else {
                  setCurrentPublicView(view as PublicView);
                }
              }}
              loading={loading}
              error={null}
            />
          );
        default:
          return <HomePage onViewChange={setCurrentPublicView} />;
      }
    };

    return (
      <div className="min-h-screen flex flex-col">
        <Header
          currentView={currentPublicView}
          onViewChange={setCurrentPublicView}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
        <main className="flex-1">{renderPublicView()}</main>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

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

    switch (currentAppView) {
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
      case 'Budget':
        return <Budget expenses={expenses} />;
      case 'profile':
        return <Profile expenses={expenses} />;
      case 'profileQuestions':
        return <ProfileQuestionsPage onComplete={() => setCurrentAppView('dashboard')} />;
      default:
        return <Dashboard expenses={expenses} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation
        currentView={currentAppView}
        onViewChange={setCurrentAppView}
        onAddExpense={() => setIsAddModalOpen(true)}
        onLogout={logout}
        userEmail={currentUser?.email || undefined}
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
