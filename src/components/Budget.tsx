import React, { useState, useEffect } from 'react';
import { Expense } from '../types/expense';
import { formatCurrency, getCategoryColor } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

interface CategorySpending {
  category: string;
  spent: number;
  budget: number;
  remaining: number;
  percentageUsed: number;
  status: 'under' | 'near' | 'over';
}

interface BudgetProps {
  expenses: Expense[];
}

const DEFAULT_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Groceries',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Utilities',
  'Travel',
  'Education',
  'Other'
];

const DEFAULT_PERCENTAGES: Record<string, number> = {
  'Food & Dining': 15,
  'Transportation': 10,
  'Groceries': 12,
  'Entertainment': 8,
  'Healthcare': 8,
  'Shopping': 10,
  'Utilities': 12,
  'Travel': 5,
  'Education': 5,
  'Other': 15
};

export const Budget: React.FC<BudgetProps> = ({ expenses }) => {
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const [categorySpending, setCategorySpending] = useState<CategorySpending[]>([]);
  const { currentUserDetails } = useAuth();

  // Set monthly income from user profile
  useEffect(() => {
    const income = currentUserDetails?.profile?.monthlyIncome;
    console.log(income)
    if (income && income > 0) {
      setMonthlyIncome(income);
    }
  }, [currentUserDetails]);

  // Calculate category spending
  useEffect(() => {
    if (monthlyIncome > 0) {
      const spending: CategorySpending[] = DEFAULT_CATEGORIES.map(category => {
        const budgetPercentage = DEFAULT_PERCENTAGES[category] || 0;
        const budgetAmount = (monthlyIncome * budgetPercentage) / 100;

        const spent = expenses
          .filter(exp => exp.category === category)
          .reduce((sum, exp) => sum + exp.amount, 0);

        const percentageUsed = (spent / budgetAmount) * 100;
        let status: 'under' | 'near' | 'over' = 'under';

        if (percentageUsed > 100) {
          status = 'over';
        } else if (percentageUsed > 90) {
          status = 'near';
        }

        return {
          category,
          spent,
          budget: budgetAmount,
          remaining: budgetAmount - spent,
          percentageUsed,
          status
        };
      });

      setCategorySpending(spending);
    } else {
      setCategorySpending([]);
    }
  }, [monthlyIncome, expenses]);

  const getStatusColor = (status: CategorySpending['status']) => {
    switch (status) {
      case 'under':
        return 'bg-green-300 bg-opacity-30 text-green-800 border-green-400';
      case 'near':
        return 'bg-yellow-200 bg-opacity-30 text-yellow-800 border-yellow-400';
      case 'over':
        return 'bg-red-300 bg-opacity-30 text-red-800 border border-red-300';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className='flex items-center justify-between'>
        <div>
          <h2 className="text-2xl font-bold">Budget Overview</h2>
          <p className="text-gray-600">Enter your monthly income to view actual vs. budgeted spending.</p>
          <input
            type="number"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(parseFloat(e.target.value))}
            className="mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your monthly income"
          />
          
        </div>
      </div>

      {categorySpending.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categorySpending.map((cat) => (
            <div
              key={cat.category}
              className={`border rounded-lg p-4 shadow-sm bg-white ${getStatusColor(cat.status)}`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{cat.category}</h3>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getCategoryColor(cat.category) }}
                />
              </div>
              <p className="mt-2 text-sm">
                Budget: {formatCurrency(cat.budget)}
              </p>
              <p className="text-sm">
                Spent: <strong>{formatCurrency(cat.spent)}</strong>
              </p>
              <p className="text-sm">
                Remaining: {formatCurrency(cat.remaining)}
              </p>
              <p className="mt-2 text-xs">
                Used: {cat.percentageUsed.toFixed(1)}%
              </p>
              <p className="text-xs italic">
                Status: {cat.status.charAt(0).toUpperCase() + cat.status.slice(1)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
