import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const listInclude = {
  _count: { select: { tasks: true } },
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { spaceId } = req.params;
    const lists = await prisma.list.findMany({
      where: { spaceId },
      include: listInclude,
      orderBy: { createdAt: 'asc' },
    });
    res.json(lists);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { spaceId } = req.params;
    const { name, color, folderId, statusConfig } = req.body as {
      name: string;
      color?: string;
      folderId?: string;
      statusConfig?: { name: string; color: string }[];
    };
    const newList = await prisma.list.create({
      data: {
        name,
        color: color ?? '#0075ff',
        spaceId,
        folderId: folderId ?? null,
        statusConfig: statusConfig ?? [
          { name: 'To Do', color: '#94a3b8' },
          { name: 'In Progress', color: '#3b82f6' },
          { name: 'Done', color: '#22c55e' },
        ],
      },
      include: listInclude,
    });
    res.status(201).json(newList);
  } catch (err) {
    next(err);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const found = await prisma.list.findUnique({
      where: { id: req.params.listId },
      include: { ...listInclude, folder: true },
    });
    if (!found) throw createError('List not found', 404);
    res.json(found);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const updated = await prisma.list.update({
      where: { id: req.params.listId },
      data: req.body as Prisma.ListUpdateInput,
      include: listInclude,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.list.delete({ where: { id: req.params.listId } });
    res.json({ message: 'List deleted' });
  } catch (err) {
    next(err);
  }
};
