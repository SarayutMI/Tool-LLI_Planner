import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import { env } from './config/env';
import { initSocket } from './socket/socket';
import { errorHandler } from './middleware/error.middleware';

import authRoutes from './routes/auth.routes';
import workspaceRoutes from './routes/workspace.routes';
import spaceRoutes from './routes/space.routes';
import folderRoutes from './routes/folder.routes';
import listRoutes from './routes/list.routes';
import taskRoutes from './routes/task.routes';
import commentRoutes from './routes/comment.routes';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CLIENT_URL,
    credentials: true,
  })
);
app.use(morgan(env.NODE_ENV === 'development' ? 'dev' : 'combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/workspaces', workspaceRoutes);
app.use('/api/workspaces/:workspaceId/spaces', spaceRoutes);
app.use('/api/spaces/:spaceId/folders', folderRoutes);
app.use('/api/spaces/:spaceId/lists', listRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api', commentRoutes);

app.use(errorHandler);

const httpServer = http.createServer(app);

initSocket(httpServer);

httpServer.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
});

export default app;
