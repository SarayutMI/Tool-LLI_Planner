import { Request, Response, NextFunction } from 'express';
import * as workspaceService from '../services/workspace.service';
import { MemberRole } from '@prisma/client';

export const list = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const workspaces = await workspaceService.getUserWorkspaces(req.user!.id);
    res.json(workspaces);
  } catch (err) {
    next(err);
  }
};

export const create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const workspace = await workspaceService.createWorkspace(req.user!.id, req.body as { name: string; color?: string; icon?: string });
    res.status(201).json(workspace);
  } catch (err) {
    next(err);
  }
};

export const get = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const workspace = await workspaceService.getWorkspaceById(req.params.workspaceId, req.user!.id);
    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

export const update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const workspace = await workspaceService.updateWorkspace(
      req.params.workspaceId,
      req.user!.id,
      req.body as { name?: string; color?: string; icon?: string }
    );
    res.json(workspace);
  } catch (err) {
    next(err);
  }
};

export const remove = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await workspaceService.deleteWorkspace(req.params.workspaceId, req.user!.id);
    res.json({ message: 'Workspace deleted' });
  } catch (err) {
    next(err);
  }
};

export const addMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, role } = req.body as { email: string; role?: MemberRole };
    const member = await workspaceService.addMember(
      req.params.workspaceId,
      req.user!.id,
      email,
      role ?? MemberRole.MEMBER
    );
    res.status(201).json(member);
  } catch (err) {
    next(err);
  }
};

export const removeMember = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await workspaceService.removeMember(req.params.workspaceId, req.user!.id, req.params.userId);
    res.json({ message: 'Member removed' });
  } catch (err) {
    next(err);
  }
};

export const updateMemberRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { role } = req.body as { role: MemberRole };
    const member = await workspaceService.updateMemberRole(
      req.params.workspaceId,
      req.user!.id,
      req.params.userId,
      role
    );
    res.json(member);
  } catch (err) {
    next(err);
  }
};
