import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar,
  PieChart,
  BarChart3
} from 'lucide-react';
import { Expense, CategoryData } from '../types/expense';
import { formatCurrency, getCategoryColor } from '../utils/helpers';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

interface DashboardProps {
  expenses: Expense[];
}

export const Dashboard: React.FC<DashboardProps> = ({ expenses }) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const now = new Date();
    return expenseDate.getMonth() === now.getMonth() && expenseDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return expenseDate.getMonth() === lastMonth.getMonth() && expenseDate.getFullYear() === lastMonth.getFullYear();
  });
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyChange = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / totalExpenses) * 100 : 0;

  // Category data for charts
  const categoryData: Record<string, CategoryData> = {};
  expenses.forEach(expense => {
    if (!categoryData[expense.category]) {
      categoryData[expense.category] = {
        name: expense.category,
        amount: 0,
        color: getCategoryColor(expense.category),
        count: 0
      };
    }
    categoryData[expense.category].amount += expense.amount;
    categoryData[expense.category].count += 1;
  });

  const categories = Object.values(categoryData).sort((a, b) => b.amount - a.amount);

  // Pie chart data
  const pieChartData = {
    labels: categories.map(cat => cat.name),
    datasets: [{
      data: categories.map(cat => cat.amount),
      backgroundColor: categories.map(cat => cat.color),
      borderWidth: 2,
      borderColor: '#fff'
    }]
  };

  // Recent expenses for bar chart (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const dailyExpenses = last7Days.map(date => {
    return expenses
      .filter(expense => expense.date === date)
      .reduce((sum, expense) => sum + expense.amount, 0);
  });

  const barChartData = {
    labels: last7Days.map(date => new Date(date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [{
      label: 'Daily Expenses',
      data: dailyExpenses,
      backgroundColor: '#3B82F6',
      borderRadius: 4
    }]
  };

  const recentExpenses = expenses.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpenses)}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(thisMonthTotal)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Calendar className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Change</p>
              <p className="text-2xl font-bold text-gray-900">{monthlyChange.toFixed(1)}%</p>
            </div>
            <div className={`p-3 rounded-lg ${monthlyChange >= 0 ? 'bg-red-100' : 'bg-green-100'}`}>
              {monthlyChange >= 0 ? (
                <TrendingUp className="h-6 w-6 text-red-600" />
              ) : (
                <TrendingDown className="h-6 w-6 text-green-600" />
              )}
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{expenses.length}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <PieChart className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Expenses by Category</h3>
          </div>
          {categories.length > 0 ? (
            <div className="h-64">
              <Pie 
                data={pieChartData} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: 'right',
                      labels: {
                        padding: 20,
                        usePointStyle: true
                      }
                    }
                  }
                }}
              />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              No expenses to display
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Daily Expenses (Last 7 Days)</h3>
          </div>
          <div className="h-64">
            <Bar 
              data={barChartData} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: function(value) {
                        return '$' + value;
                      }
                    }
                  }
                },
                plugins: {
                  legend: {
                    display: false
                  }
                }
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Expenses and Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <span>{expense.category}</span>
                      <span>•</span>
                      <span>{new Date(expense.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">No expenses yet</p>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
          <div className="space-y-3">
            {categories.slice(0, 5).map((category) => (
              <div key={category.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  ></div>
                  <div>
                    <p className="font-medium text-gray-900">{category.name}</p>
                    <p className="text-sm text-gray-600">{category.count} transactions</p>
                  </div>
                </div>
                <p className="font-semibold text-gray-900">{formatCurrency(category.amount)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
