import { Router } from 'express';

import {
  getAdminNotifications,
  markAdminNotificationRead,
  markAllAdminNotificationsRead,
  deleteAdminNotification
} from '../controllers/notification.controller.js';

import { protect, authorize } from '../middlewares/auth.middleware.js';

const notificationRouter = Router();

notificationRouter.use(protect, authorize('admin'));

notificationRouter.get('/', getAdminNotifications);

notificationRouter.patch('/read-all', markAllAdminNotificationsRead);

notificationRouter.patch('/:id/read', markAdminNotificationRead);

notificationRouter.delete('/:id', deleteAdminNotification);

export default notificationRouter;