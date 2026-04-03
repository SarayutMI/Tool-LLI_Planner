import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const spaceInclude = {
  members: {
    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
  },
  _count: { select: { folders: true, lists: true } },
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: req.user!.id } },
    });
    if (!member) throw createError('Access denied', 403);

    const spaces = await prisma.space.findMany({
      where: { workspaceId },
      include: spaceInclude,
      orderBy: { createdAt: 'asc' },
    });
    res.json(spaces);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { workspaceId } = req.params;
    const { name, color, icon, isPrivate } = req.body as {
      name: string;
      color?: string;
      icon?: string;
      isPrivate?: boolean;
    };

    const member = await prisma.workspaceMember.findUnique({
      where: { workspaceId_userId: { workspaceId, userId: req.user!.id } },
    });
    if (!member) throw createError('Access denied', 403);

    const space = await prisma.space.create({
      data: {
        name,
        color: color ?? '#0075ff',
        icon,
        workspaceId,
        isPrivate: isPrivate ?? false,
        members: { create: { userId: req.user!.id } },
      },
      include: spaceInclude,
    });
    res.status(201).json(space);
  } catch (err) {
    next(err);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { spaceId } = req.params;
    const space = await prisma.space.findUnique({
      where: { id: spaceId },
      include: {
        ...spaceInclude,
        folders: {
          include: { lists: { include: { _count: { select: { tasks: true } } } } },
          orderBy: { createdAt: 'asc' },
        },
        lists: {
          where: { folderId: null },
          include: { _count: { select: { tasks: true } } },
          orderBy: { createdAt: 'asc' },
        },
      },
    });
    if (!space) throw createError('Space not found', 404);
    res.json(space);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { spaceId } = req.params;
    const space = await prisma.space.update({
      where: { id: spaceId },
      data: req.body as { name?: string; color?: string; icon?: string; isPrivate?: boolean },
      include: spaceInclude,
    });
    res.json(space);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.space.delete({ where: { id: req.params.spaceId } });
    res.json({ message: 'Space deleted' });
  } catch (err) {
    next(err);
  }
};
