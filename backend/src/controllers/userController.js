// User Controller
import { UserModel } from '../models/User.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';

export const getCurrentUser = (req, res) => {
  try {
    const user = UserModel.getCurrentUser();
    return res.json({ user });
  } catch (err) {
    return errorResponse(res, 'Failed to get user profile', 500, err);
  }
};

export const updateCurrentUser = (req, res) => {
  try {
    const user = UserModel.updateCurrentUser(req.body);
    return res.json({ user });
  } catch (err) {
    return errorResponse(res, 'Failed to update user profile', 500, err);
  }
};

export const login = (req, res) => {
  try {
    const { email } = req.body;
    const user = UserModel.loginOrRegister({ email });
    return res.json({ success: true, user, token: 'mock_jwt_token_explorer_123' });
  } catch (err) {
    return errorResponse(res, 'Login failed', 500, err);
  }
};

export const register = (req, res) => {
  try {
    const { name, email } = req.body;
    const user = UserModel.loginOrRegister({ name, email });
    return res.json({ success: true, user, token: 'mock_jwt_token_explorer_123' });
  } catch (err) {
    return errorResponse(res, 'Registration failed', 500, err);
  }
};

export default {
  getCurrentUser,
  updateCurrentUser,
  login,
  register,
};
