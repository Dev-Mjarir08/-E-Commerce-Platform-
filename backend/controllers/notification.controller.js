import Notification from '../models/Notification.js';

// GET /api/admin/notifications
export const getAdminNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user._id
    })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      notifications
    });
  } catch (error) {
    console.error('Get admin notifications error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications.'
    });
  }
};

// PATCH /api/admin/notifications/:id/read
export const markAdminNotificationRead = async (req, res) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      {
        _id: req.params.id,
        recipient: req.user._id
      },
      {
        isRead: true,
        readAt: new Date()
      },
      {
        new: true
      }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.'
      });
    }

    return res.status(200).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Mark notification read error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to mark notification as read.'
    });
  }
};

// PATCH /api/admin/notifications/read-all
export const markAllAdminNotificationsRead = async (req, res) => {
  try {
    const result = await Notification.updateMany(
      {
        recipient: req.user._id,
        isRead: false
      },
      {
        $set: {
          isRead: true,
          readAt: new Date()
        }
      }
    );

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read.',
      updatedCount: result.modifiedCount
    });
  } catch (error) {
    console.error('Mark all notifications read error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read.'
    });
  }
};

// DELETE /api/admin/notifications/:id
export const deleteAdminNotification = async (req, res) => {
  try {
    const notification = await Notification.findOneAndDelete({
      _id: req.params.id,
      recipient: req.user._id
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found.'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Notification removed successfully.'
    });
  } catch (error) {
    console.error('Delete notification error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to delete notification.'
    });
  }
};