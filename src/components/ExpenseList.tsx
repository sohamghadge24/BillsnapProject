import React, { useState } from 'react';
import {
  Search,
  Filter,
  Tag,
  Trash2,
  Edit3,
  Eye,
  Download
} from 'lucide-react';
import { Expense, ExpenseFilters } from '../types/expense';
import {
  formatCurrency,
  formatDate,
  getExpenseCategories
} from '../utils/helpers';

interface ExpenseListProps {
  expenses: Expense[];
  onDeleteExpense: (id: string) => void;
  onUpdateExpense: (id: string, updates: Partial<Expense>) => void;
}

export const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDeleteExpense,
  onUpdateExpense
}) => {
  const [filters, setFilters] = useState<ExpenseFilters>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Expense>>({});

  const filteredExpenses = expenses.filter(expense => {
    const matchesCategory = !filters.category || expense.category === filters.category;
    const matchesSearch = !filters.searchTerm || expense.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());
    const matchesDateFrom = !filters.dateFrom || new Date(expense.date) >= new Date(filters.dateFrom);
    const matchesDateTo = !filters.dateTo || new Date(expense.date) <= new Date(filters.dateTo);
    return matchesCategory && matchesSearch && matchesDateFrom && matchesDateTo;
  });

  const startEdit = (expense: Expense) => {
    setEditingId(expense.id);
    setEditForm({
      amount: expense.amount,
      description: expense.description,
      category: expense.category,
      date: expense.date
    });
  };

  const saveEdit = () => {
    if (editingId) {
      onUpdateExpense(editingId, editForm);
      cancelEdit();
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const rows = filteredExpenses.map(exp =>
      [exp.date, exp.description, exp.category, exp.amount].join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'expenses.csv';
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Expenses</h2>
          <p className="text-gray-600">{filteredExpenses.length} of {expenses.length} expenses</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Download className="h-4 w-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search description..."
                value={filters.searchTerm || ''}
                onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={filters.category || ''}
                onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Categories</option>
                {getExpenseCategories().map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date From */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={filters.dateFrom || ''}
              onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Date To */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={filters.dateTo || ''}
              onChange={(e) => setFilters({ ...filters, dateTo: e.target.value || undefined })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredExpenses.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3">Description</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredExpenses.map((expense) => (
                  <tr key={expense.id} className="hover:bg-gray-50">
                    {editingId === expense.id ? (
                      <>
                        <td className="px-6 py-4">
                          <input
                            type="date"
                            value={editForm.date || ''}
                            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="text"
                            value={editForm.description || ''}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={editForm.category || ''}
                            onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                            className="w-full border rounded px-2 py-1"
                          >
                            {getExpenseCategories().map(category => (
                              <option key={category} value={category}>{category}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <input
                            type="number"
                            value={editForm.amount ?? ''}
                            onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
                            className="w-full border rounded px-2 py-1"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={saveEdit} className="text-green-600 font-medium">Save</button>
                            <button onClick={cancelEdit} className="text-gray-600 font-medium">Cancel</button>
                          </div>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4">{formatDate(expense.date)}</td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{expense.description}</p>
                          {expense.receipt && (
                            <button
                              onClick={() => window.open(expense.receipt!, '_blank')}
                              className="text-blue-600 text-xs flex items-center space-x-1 mt-1"
                            >
                              <Eye className="h-3 w-3" />
                              <span>View Receipt</span>
                            </button>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex px-2 py-0.5 text-xs bg-gray-100 rounded-full">
                            {expense.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">{formatCurrency(expense.amount)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => startEdit(expense)}
                              title="Edit"
                              className="text-blue-600"
                            >
                              <Edit3 className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => onDeleteExpense(expense.id)}
                              title="Delete"
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Filter className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No expenses found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {expenses.length === 0
                ? 'Get started by adding your first expense.'
                : 'Try adjusting your filters.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
