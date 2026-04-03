import { Request, Response, NextFunction } from 'express';
import * as taskService from '../services/task.service';
import * as notificationService from '../services/notification.service';
import { createTaskSchema, updateTaskSchema, reorderTasksSchema } from '../validators/task.validator';
import { TaskPriority } from '@prisma/client';
import { getIO } from '../socket/socket';

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = createTaskSchema.parse(req.body);
    const task = await taskService.createTask({
      ...data,
      priority: data.priority as TaskPriority | undefined,
    });
    const io = getIO();
    if (io) io.emit('task:created', task);
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
};

export const getByList = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tasks = await taskService.getTasksByList(req.params.listId);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await taskService.getTaskById(req.params.taskId);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const data = updateTaskSchema.parse(req.body);
    const task = await taskService.updateTask(req.params.taskId, {
      ...data,
      priority: data.priority as TaskPriority | undefined,
    });
    const io = getIO();
    if (io) io.emit('task:updated', task);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await taskService.deleteTask(req.params.taskId);
    const io = getIO();
    if (io) io.emit('task:deleted', { id: req.params.taskId });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    next(err);
  }
};

export const updateStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { status } = req.body as { status: string };
    const task = await taskService.updateTaskStatus(req.params.taskId, status);
    const io = getIO();
    if (io) io.emit('task:updated', task);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const updatePriority = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { priority } = req.body as { priority: TaskPriority };
    const task = await taskService.updateTaskPriority(req.params.taskId, priority);
    const io = getIO();
    if (io) io.emit('task:updated', task);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const addAssignee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { userId } = req.body as { userId: string };
    const task = await taskService.addAssignee(req.params.taskId, userId);
    await notificationService.createNotification({
      userId,
      type: 'TASK_ASSIGNED',
      message: `You have been assigned to a task`,
      taskId: req.params.taskId,
    });
    const io = getIO();
    if (io) {
      io.emit('task:updated', task);
      io.to(`user:${userId}`).emit('notification:new', {
        type: 'TASK_ASSIGNED',
        message: 'You have been assigned to a task',
        taskId: req.params.taskId,
      });
    }
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const removeAssignee = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const task = await taskService.removeAssignee(req.params.taskId, req.params.userId);
    const io = getIO();
    if (io) io.emit('task:updated', task);
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const reorder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { tasks } = reorderTasksSchema.parse(req.body);
    await taskService.reorderTasks(tasks);
    res.json({ message: 'Tasks reordered' });
  } catch (err) {
    next(err);
  }
};

export const getSubtasks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subtasks = await taskService.getSubtasks(req.params.taskId);
    res.json(subtasks);
  } catch (err) {
    next(err);
  }
};
