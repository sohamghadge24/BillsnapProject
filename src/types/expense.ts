//../types/expense.ts

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  receipt: string | null;
  userId?: string;
  createdAt?: any;
  updatedAt?: any;
}

export interface ExpenseFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  searchTerm?: string;
}

export interface CategoryData {
  name: string;
  amount: number;
  color: string;
  count: number;
}