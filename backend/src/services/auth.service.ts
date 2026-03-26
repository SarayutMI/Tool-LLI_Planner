import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import prisma from '../config/database';
import { env } from '../config/env';
import { createError } from '../middleware/error.middleware';
import { MemberRole } from '@prisma/client';

interface TokenPayload {
  id: string;
  email: string;
  name: string;
}

const generateAccessToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions);

const generateRefreshToken = (payload: TokenPayload): string =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES_IN } as jwt.SignOptions);

export const register = async (email: string, password: string, name: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw createError('Email already in use', 409);

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { email, password: hashedPassword, name },
    select: { id: true, email: true, name: true, avatar: true, createdAt: true },
  });

  await prisma.workspace.create({
    data: {
      name: `${name}'s Workspace`,
      ownerId: user.id,
      members: {
        create: { userId: user.id, role: MemberRole.OWNER },
      },
    },
  });

  const payload: TokenPayload = { id: user.id, email: user.email, name: user.name };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  return { user, accessToken, refreshToken };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw createError('Invalid email or password', 401);

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw createError('Invalid email or password', 401);

  const payload: TokenPayload = { id: user.id, email: user.email, name: user.name };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await prisma.refreshToken.create({
    data: { token: refreshToken, userId: user.id, expiresAt },
  });

  const { password: _, ...safeUser } = user;
  return { user: safeUser, accessToken, refreshToken };
};

export const refreshAccessToken = async (token: string) => {
  const stored = await prisma.refreshToken.findUnique({ where: { token }, include: { user: true } });
  if (!stored || stored.expiresAt < new Date()) {
    throw createError('Invalid or expired refresh token', 401);
  }

  let decoded: TokenPayload;
  try {
    decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
  } catch {
    throw createError('Invalid refresh token', 401);
  }

  const payload: TokenPayload = { id: decoded.id, email: decoded.email, name: decoded.name };
  const accessToken = generateAccessToken(payload);
  return { accessToken };
};

export const logout = async (token: string) => {
  await prisma.refreshToken.deleteMany({ where: { token } });
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true, avatar: true, createdAt: true, updatedAt: true },
  });
  if (!user) throw createError('User not found', 404);
  return user;
};
