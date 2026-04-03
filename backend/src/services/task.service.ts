import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';
import { TaskPriority, Prisma } from '@prisma/client';

const taskInclude = {
  assignees: {
    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
  },
  _count: { select: { comments: true, subtasks: true } },
};

export const createTask = async (data: {
  title: string;
  description?: string;
  status?: string;
  priority?: TaskPriority;
  listId: string;
  parentTaskId?: string;
  dueDate?: string;
  startDate?: string;
  tags?: string[];
  customFields?: Record<string, unknown>;
}) => {
  const maxOrderTask = await prisma.task.findFirst({
    where: { listId: data.listId, parentTaskId: data.parentTaskId ?? null },
    orderBy: { order: 'desc' },
    select: { order: true },
  });
  const order = (maxOrderTask?.order ?? -1) + 1;

  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description,
      status: data.status ?? 'To Do',
      priority: data.priority ?? TaskPriority.NONE,
      listId: data.listId,
      parentTaskId: data.parentTaskId,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      tags: data.tags ?? [],
      customFields: data.customFields as Prisma.InputJsonValue | undefined,
      order,
    },
    include: taskInclude,
  });
};

export const getTasksByList = async (listId: string) => {
  return prisma.task.findMany({
    where: { listId, parentTaskId: null },
    include: {
      ...taskInclude,
      subtasks: { include: taskInclude, orderBy: { order: 'asc' } },
    },
    orderBy: { order: 'asc' },
  });
};

export const getTaskById = async (taskId: string) => {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      ...taskInclude,
      subtasks: { include: taskInclude, orderBy: { order: 'asc' } },
      comments: {
        where: { parentId: null },
        include: {
          author: { select: { id: true, name: true, email: true, avatar: true } },
          replies: {
            include: {
              author: { select: { id: true, name: true, email: true, avatar: true } },
            },
            orderBy: { createdAt: 'asc' },
          },
        },
        orderBy: { createdAt: 'asc' },
      },
    },
  });
  if (!task) throw createError('Task not found', 404);
  return task;
};

export const updateTask = async (
  taskId: string,
  data: {
    title?: string;
    description?: string | null;
    status?: string;
    priority?: TaskPriority;
    dueDate?: string | null;
    startDate?: string | null;
    tags?: string[];
    customFields?: Record<string, unknown> | null;
    order?: number;
  }
) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw createError('Task not found', 404);

  return prisma.task.update({
    where: { id: taskId },
    data: {
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      tags: data.tags,
      order: data.order,
      dueDate: data.dueDate === null ? null : data.dueDate ? new Date(data.dueDate) : undefined,
      startDate: data.startDate === null ? null : data.startDate ? new Date(data.startDate) : undefined,
      customFields:
        data.customFields === null
          ? Prisma.JsonNull
          : data.customFields !== undefined
          ? (data.customFields as Prisma.InputJsonValue)
          : undefined,
    },
    include: taskInclude,
  });
};

export const deleteTask = async (taskId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw createError('Task not found', 404);
  await prisma.task.delete({ where: { id: taskId } });
};

export const updateTaskStatus = async (taskId: string, status: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw createError('Task not found', 404);
  return prisma.task.update({ where: { id: taskId }, data: { status }, include: taskInclude });
};

export const updateTaskPriority = async (taskId: string, priority: TaskPriority) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw createError('Task not found', 404);
  return prisma.task.update({ where: { id: taskId }, data: { priority }, include: taskInclude });
};

export const addAssignee = async (taskId: string, userId: string) => {
  const task = await prisma.task.findUnique({ where: { id: taskId } });
  if (!task) throw createError('Task not found', 404);

  const existing = await prisma.taskAssignee.findUnique({
    where: { taskId_userId: { taskId, userId } },
  });
  if (existing) throw createError('User is already assigned', 409);

  await prisma.taskAssignee.create({ data: { taskId, userId } });
  return prisma.task.findUnique({ where: { id: taskId }, include: taskInclude });
};

export const removeAssignee = async (taskId: string, userId: string) => {
  const assignee = await prisma.taskAssignee.findUnique({
    where: { taskId_userId: { taskId, userId } },
  });
  if (!assignee) throw createError('Assignee not found', 404);
  await prisma.taskAssignee.delete({ where: { taskId_userId: { taskId, userId } } });
  return prisma.task.findUnique({ where: { id: taskId }, include: taskInclude });
};

export const reorderTasks = async (tasks: { id: string; order: number }[]) => {
  await prisma.$transaction(
    tasks.map(({ id, order }) => prisma.task.update({ where: { id }, data: { order } }))
  );
};

export const getSubtasks = async (parentTaskId: string) => {
  return prisma.task.findMany({
    where: { parentTaskId },
    include: taskInclude,
    orderBy: { order: 'asc' },
  });
};
