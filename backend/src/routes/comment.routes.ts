import { Router } from 'express';
import * as commentController from '../controllers/comment.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.get('/tasks/:taskId/comments', commentController.list);
router.post('/tasks/:taskId/comments', commentController.create);
router.put('/comments/:commentId', commentController.update);
router.delete('/comments/:commentId', commentController.remove);
router.post('/comments/:commentId/reactions', commentController.addReaction);

router.get('/notifications', commentController.getNotifications);
router.patch('/notifications/:notificationId/read', commentController.markNotificationRead);
router.patch('/notifications/read-all', commentController.markAllNotificationsRead);
router.get('/notifications/unread-count', commentController.getUnreadCount);

export default router;
