import { useEffect, useState } from 'react';
import { Expense } from '../types/expense';
import { FirebaseService } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';

export const useExpenses = () => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = FirebaseService.subscribeToExpenses(currentUser.uid, (data) => {
      setExpenses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return { expenses, loading };
};
