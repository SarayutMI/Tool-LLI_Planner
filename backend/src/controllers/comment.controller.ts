import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';
import * as notificationService from '../services/notification.service';
import { getIO } from '../socket/socket';

const commentInclude = {
  author: { select: { id: true, name: true, email: true, avatar: true } },
  replies: {
    include: {
      author: { select: { id: true, name: true, email: true, avatar: true } },
    },
    orderBy: { createdAt: 'asc' as const },
  },
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const comments = await prisma.comment.findMany({
      where: { taskId: req.params.taskId, parentId: null },
      include: commentInclude,
      orderBy: { createdAt: 'asc' },
    });
    res.json(comments);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { content, parentId } = req.body as { content: string; parentId?: string };
    if (!content?.trim()) {
      throw createError('Content is required', 400);
    }
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        taskId: req.params.taskId,
        authorId: req.user!.id,
        parentId: parentId ?? null,
      },
      include: commentInclude,
    });

    const task = await prisma.task.findUnique({
      where: { id: req.params.taskId },
      include: { assignees: { select: { userId: true } } },
    });

    if (task) {
      const recipientIds = task.assignees
        .map((a) => a.userId)
        .filter((id) => id !== req.user!.id);

      for (const userId of recipientIds) {
        await notificationService.createNotification({
          userId,
          type: 'COMMENT_ADDED',
          message: `${req.user!.name} commented on a task`,
          taskId: req.params.taskId,
        });
        const io = getIO();
        if (io) {
          io.to(`user:${userId}`).emit('notification:new', {
            type: 'COMMENT_ADDED',
            message: `${req.user!.name} commented on a task`,
            taskId: req.params.taskId,
          });
        }
      }
    }

    const io = getIO();
    if (io) io.to(`task:${req.params.taskId}`).emit('comment:added', comment);
    res.status(201).json(comment);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.commentId } });
    if (!comment) throw createError('Comment not found', 404);
    if (comment.authorId !== req.user!.id) throw createError('Not authorized', 403);

    const { content } = req.body as { content: string };
    const updated = await prisma.comment.update({
      where: { id: req.params.commentId },
      data: { content },
      include: commentInclude,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const comment = await prisma.comment.findUnique({ where: { id: req.params.commentId } });
    if (!comment) throw createError('Comment not found', 404);
    if (comment.authorId !== req.user!.id) throw createError('Not authorized', 403);

    await prisma.comment.delete({ where: { id: req.params.commentId } });
    res.json({ message: 'Comment deleted' });
  } catch (err) {
    next(err);
  }
};

export const addReaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { emoji } = req.body as { emoji: string };
    const comment = await prisma.comment.findUnique({ where: { id: req.params.commentId } });
    if (!comment) throw createError('Comment not found', 404);

    const reactions = (comment.reactions as Record<string, string[]>) ?? {};
    if (!reactions[emoji]) reactions[emoji] = [];
    const idx = reactions[emoji].indexOf(req.user!.id);
    if (idx === -1) {
      reactions[emoji].push(req.user!.id);
    } else {
      reactions[emoji].splice(idx, 1);
      if (reactions[emoji].length === 0) delete reactions[emoji];
    }

    const updated = await prisma.comment.update({
      where: { id: req.params.commentId },
      data: { reactions },
      include: commentInclude,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const getNotifications = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await notificationService.getUserNotifications(req.user!.id, page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const markNotificationRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await notificationService.markNotificationRead(req.params.notificationId, req.user!.id);
    res.json({ message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
};

export const markAllNotificationsRead = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await notificationService.markAllNotificationsRead(req.user!.id);
    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

export const getUnreadCount = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const count = await notificationService.getUnreadCount(req.user!.id);
    res.json({ count });
  } catch (err) {
    next(err);
  }
};
