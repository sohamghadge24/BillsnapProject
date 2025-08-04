// src/components/ExpenseLoader.tsx

import React, { useEffect, useState } from 'react';
import { getDoc, DocumentReference } from 'firebase/firestore';
import { Expense } from '../types/expense';

interface ExpenseLoaderProps {
  expenseRefs: DocumentReference[]; // array of Firestore DocumentReferences
}

export const ExpenseLoader: React.FC<ExpenseLoaderProps> = ({ expenseRefs }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.all(
          expenseRefs.map(async (ref) => {
            try {
              const docSnap = await getDoc(ref);
              if (docSnap.exists()) {
                return { id: docSnap.id, ...docSnap.data() } as Expense;
              } else {
                console.warn(`Document ${ref.id} does not exist.`);
                return null;
              }
            } catch (err) {
              console.error(`Error fetching document ${ref.id}:`, err);
              return null;
            }
          })
        );

        const filteredExpenses = results.filter((exp): exp is Expense => exp !== null);
        setExpenses(filteredExpenses);
      } catch (err) {
        console.error('Error loading expenses:', err);
        setError('Failed to load expenses.');
      } finally {
        setLoading(false);
      }
    };

    if (expenseRefs.length > 0) {
      fetchExpenses();
    } else {
      setExpenses([]);
      setLoading(false);
    }
  }, [expenseRefs]);

  if (loading) {
    return <div>Loading expenses...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">Loaded Expenses</h3>
      {expenses.length === 0 ? (
        <p>No expenses found.</p>
      ) : (
        <ul className="list-disc list-inside">
          {expenses.map((expense) => (
            <li key={expense.id}>
              {expense.description} - ${expense.amount.toFixed(2)} on {expense.date}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
