import prisma from '../config/database';
import { createError } from '../middleware/error.middleware';
import { MemberRole } from '@prisma/client';

export const getUserWorkspaces = async (userId: string) => {
  return prisma.workspace.findMany({
    where: { members: { some: { userId } } },
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      _count: { select: { spaces: true, members: true } },
    },
    orderBy: { createdAt: 'asc' },
  });
};

export const createWorkspace = async (userId: string, data: { name: string; color?: string; icon?: string }) => {
  return prisma.workspace.create({
    data: {
      name: data.name,
      color: data.color ?? '#0075ff',
      icon: data.icon,
      ownerId: userId,
      members: { create: { userId, role: MemberRole.OWNER } },
    },
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
    },
  });
};

export const getWorkspaceById = async (workspaceId: string, userId: string) => {
  const workspace = await prisma.workspace.findFirst({
    where: { id: workspaceId, members: { some: { userId } } },
    include: {
      owner: { select: { id: true, name: true, email: true, avatar: true } },
      members: {
        include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
      },
      spaces: {
        include: {
          members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
          _count: { select: { folders: true, lists: true } },
        },
      },
      tags: true,
    },
  });
  if (!workspace) throw createError('Workspace not found', 404);
  return workspace;
};

export const updateWorkspace = async (
  workspaceId: string,
  userId: string,
  data: { name?: string; color?: string; icon?: string }
) => {
  const member = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId } },
  });
  if (!member || (member.role !== MemberRole.OWNER && member.role !== MemberRole.ADMIN)) {
    throw createError('Insufficient permissions', 403);
  }
  return prisma.workspace.update({
    where: { id: workspaceId },
    data,
    include: { owner: { select: { id: true, name: true, email: true, avatar: true } } },
  });
};

export const deleteWorkspace = async (workspaceId: string, userId: string) => {
  const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
  if (!workspace) throw createError('Workspace not found', 404);
  if (workspace.ownerId !== userId) throw createError('Only the owner can delete a workspace', 403);
  await prisma.workspace.delete({ where: { id: workspaceId } });
};

export const addMember = async (workspaceId: string, requesterId: string, email: string, role: MemberRole) => {
  const requester = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: requesterId } },
  });
  if (!requester || (requester.role !== MemberRole.OWNER && requester.role !== MemberRole.ADMIN)) {
    throw createError('Insufficient permissions', 403);
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw createError('User not found', 404);

  const existing = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: user.id } },
  });
  if (existing) throw createError('User is already a member', 409);

  return prisma.workspaceMember.create({
    data: { workspaceId, userId: user.id, role },
    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
  });
};

export const removeMember = async (workspaceId: string, requesterId: string, targetUserId: string) => {
  const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
  if (!workspace) throw createError('Workspace not found', 404);

  const requester = await prisma.workspaceMember.findUnique({
    where: { workspaceId_userId: { workspaceId, userId: requesterId } },
  });
  if (!requester || (requester.role !== MemberRole.OWNER && requester.role !== MemberRole.ADMIN)) {
    throw createError('Insufficient permissions', 403);
  }
  if (workspace.ownerId === targetUserId) throw createError('Cannot remove the workspace owner', 400);

  await prisma.workspaceMember.delete({
    where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
  });
};

export const updateMemberRole = async (
  workspaceId: string,
  requesterId: string,
  targetUserId: string,
  role: MemberRole
) => {
  const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
  if (!workspace) throw createError('Workspace not found', 404);
  if (workspace.ownerId !== requesterId) throw createError('Only the owner can change roles', 403);
  if (role === MemberRole.OWNER) throw createError('Cannot assign owner role', 400);

  return prisma.workspaceMember.update({
    where: { workspaceId_userId: { workspaceId, userId: targetUserId } },
    data: { role },
    include: { user: { select: { id: true, name: true, email: true, avatar: true } } },
  });
};
