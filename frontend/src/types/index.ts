export enum TaskPriority {
  NONE = 'NONE',
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export enum MemberRole {
  OWNER = 'OWNER',
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

export enum ViewType {
  LIST = 'LIST',
  BOARD = 'BOARD',
  CALENDAR = 'CALENDAR',
  TABLE = 'TABLE',
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface WorkspaceMember {
  workspaceId: string;
  userId: string;
  role: MemberRole;
  user: User;
}

export interface Workspace {
  id: string;
  name: string;
  color: string;
  icon?: string;
  ownerId: string;
  members: WorkspaceMember[];
  createdAt: string;
}

export interface SpaceMember {
  spaceId: string;
  userId: string;
  user: User;
}

export interface Space {
  id: string;
  name: string;
  color: string;
  icon?: string;
  workspaceId: string;
  isPrivate: boolean;
  members: SpaceMember[];
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  color: string;
  spaceId: string;
  createdAt: string;
}

export interface TaskStatus {
  name: string;
  color: string;
}

export interface List {
  id: string;
  name: string;
  color: string;
  folderId?: string;
  spaceId: string;
  statusConfig: TaskStatus[];
  createdAt: string;
}

export interface TaskAssignee {
  taskId: string;
  userId: string;
  user: User;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: TaskPriority;
  listId: string;
  parentTaskId?: string;
  dueDate?: string;
  startDate?: string;
  order: number;
  customFields?: Record<string, unknown>;
  tags: string[];
  assignees: TaskAssignee[];
  subtasks?: Task[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  taskId: string;
  authorId: string;
  author: User;
  parentId?: string;
  replies?: Comment[];
  reactions: Record<string, string[]>;
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  workspaceId: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  message: string;
  isRead: boolean;
  taskId?: string;
  createdAt: string;
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'dropdown' | 'checkbox';
  value?: unknown;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}
