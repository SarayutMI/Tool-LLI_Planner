import { Request, Response, NextFunction } from 'express';
import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';

const folderInclude = {
  lists: {
    include: { _count: { select: { tasks: true } } },
    orderBy: { createdAt: 'asc' as const },
  },
};

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const folders = await prisma.folder.findMany({
      where: { spaceId: req.params.spaceId },
      include: folderInclude,
      orderBy: { createdAt: 'asc' },
    });
    res.json(folders);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { spaceId } = req.params;
    const { name, color } = req.body as { name: string; color?: string };
    const folder = await prisma.folder.create({
      data: { name, color: color ?? '#0075ff', spaceId },
      include: folderInclude,
    });
    res.status(201).json(folder);
  } catch (err) {
    next(err);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const folder = await prisma.folder.findUnique({
      where: { id: req.params.folderId },
      include: folderInclude,
    });
    if (!folder) throw createError('Folder not found', 404);
    res.json(folder);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const folder = await prisma.folder.update({
      where: { id: req.params.folderId },
      data: req.body as { name?: string; color?: string },
      include: folderInclude,
    });
    res.json(folder);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await prisma.folder.delete({ where: { id: req.params.folderId } });
    res.json({ message: 'Folder deleted' });
  } catch (err) {
    next(err);
  }
};
