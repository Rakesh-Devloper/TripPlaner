// Notification Controller
import { initialNotifications } from '../utils/seedData.js';
import { errorResponse } from '../utils/responseHelper.js';

let notifications = [...initialNotifications];

export const getAllNotifications = (req, res) => {
  try {
    return res.json({ notifications });
  } catch (err) {
    return errorResponse(res, 'Failed to fetch notifications', 500, err);
  }
};

export const markAsRead = (req, res) => {
  try {
    const notif = notifications.find((n) => n.id === req.params.id);
    if (notif) notif.read = true;
    return res.json({ success: true });
  } catch (err) {
    return errorResponse(res, 'Failed to mark notification as read', 500, err);
  }
};

export const markAllAsRead = (req, res) => {
  try {
    notifications.forEach((n) => {
      n.read = true;
    });
    return res.json({ success: true });
  } catch (err) {
    return errorResponse(res, 'Failed to mark all as read', 500, err);
  }
};

export default {
  getAllNotifications,
  markAsRead,
  markAllAsRead,
};
