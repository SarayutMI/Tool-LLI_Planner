import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userName?: string;
}

let io: Server | null = null;

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: env.CLIENT_URL,
      methods: ['GET', 'POST'],
      credentials: true,
    },
  });

  io.use((socket: AuthenticatedSocket, next) => {
    const token =
      socket.handshake.auth.token ||
      (socket.handshake.headers.authorization?.startsWith('Bearer ')
        ? socket.handshake.headers.authorization.split(' ')[1]
        : undefined);

    if (!token) {
      return next(new Error('Authentication required'));
    }

    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; name: string };
      socket.userId = decoded.id;
      socket.userName = decoded.name;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket: AuthenticatedSocket) => {
    if (socket.userId) {
      socket.join(`user:${socket.userId}`);
    }

    socket.on('workspace:join', (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`);
    });

    socket.on('workspace:leave', (workspaceId: string) => {
      socket.leave(`workspace:${workspaceId}`);
    });

    socket.on('task:join', (taskId: string) => {
      socket.join(`task:${taskId}`);
    });

    socket.on('task:leave', (taskId: string) => {
      socket.leave(`task:${taskId}`);
    });

    socket.on('disconnect', () => {
      // cleanup handled automatically by socket.io
    });
  });

  return io;
};

export const getIO = (): Server | null => io;

export const emitToWorkspace = (workspaceId: string, event: string, data: unknown): void => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit(event, data);
  }
};

export const emitToUser = (userId: string, event: string, data: unknown): void => {
  if (io) {
    io.to(`user:${userId}`).emit(event, data);
  }
};
