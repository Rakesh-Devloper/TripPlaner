// Expense Controller
import { ExpenseModel } from '../models/Expense.js';
import { errorResponse } from '../utils/responseHelper.js';

export const getAllExpenses = (req, res) => {
  try {
    const { tripId } = req.query;
    const expenses = ExpenseModel.getAll(tripId);
    return res.json({ expenses });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch expenses', 500, err);
  }
};

export const createExpense = (req, res) => {
  try {
    const expense = ExpenseModel.create(req.body);
    return res.status(201).json({ success: true, expense });
  } catch (err) {
    return errorResponse(res, 'Failed to record expense', 500, err);
  }
};

export const deleteExpense = (req, res) => {
  try {
    const success = ExpenseModel.delete(req.params.id);
    return res.json({ success });
  } catch (err) {
    return errorResponse(res, 'Failed to delete expense', 500, err);
  }
};

export default {
  getAllExpenses,
  createExpense,
  deleteExpense,
};
