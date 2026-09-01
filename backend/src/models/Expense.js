// Expense Model & In-memory Store
import { initialExpenses } from '../utils/seedData.js';

let expenses = [...initialExpenses];

export const ExpenseModel = {
  getAll: (tripId) => {
    if (tripId) {
      return expenses.filter((e) => e.tripId === tripId);
    }
    return [...expenses];
  },

  create: (expenseData) => {
    const newExpense = {
      id: expenseData.id || `exp_${Date.now()}`,
      ...expenseData,
      date: expenseData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };
    expenses.unshift(newExpense);
    return newExpense;
  },

  delete: (id) => {
    const prevLen = expenses.length;
    expenses = expenses.filter((e) => e.id !== id);
    return expenses.length < prevLen;
  },
};

export default ExpenseModel;
