# ClickUp Clone — Full-Scale Project Management App

A full-scale ClickUp clone built with React, Node.js, PostgreSQL, and Socket.io. Features a Black & Blue dark theme.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 + Vite + TypeScript |
| Backend | Node.js + Express + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Real-time | Socket.io |
| Auth | JWT (Access + Refresh Token) |
| State | Zustand |
| Styling | Tailwind CSS (Black & Blue dark theme) |
| HTTP | Axios |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- npm 9+

### 1. Clone & Setup

```bash
git clone <repo-url>
cd Tool-LLI_Planner
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your DATABASE_URL and secrets
npm install
npx prisma migrate dev --name init
npx prisma generate
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:3000`.

### 4. Seed Database (Optional)

```bash
cd backend
npm run prisma:seed
```

## 🐳 Docker Compose (Full Stack)

```bash
docker-compose up --build
```

This starts:
- PostgreSQL on port 5432
- Backend API on port 4000
- Frontend on port 3000

## 🔑 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://postgres:password@localhost:5432/clickup_clone` |
| `JWT_SECRET` | Access token signing secret | — |
| `JWT_REFRESH_SECRET` | Refresh token signing secret | — |
| `JWT_EXPIRES_IN` | Access token expiry | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `7d` |
| `PORT` | Backend port | `4000` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:3000` |

## 📡 API Overview

### Auth
- `POST /api/auth/register` — Register
- `POST /api/auth/login` — Login (returns JWT)
- `POST /api/auth/refresh` — Refresh token
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Current user

### Workspaces
- `GET /api/workspaces` — List workspaces
- `POST /api/workspaces` — Create workspace
- `GET /api/workspaces/:id` — Get workspace
- `PUT /api/workspaces/:id` — Update workspace
- `DELETE /api/workspaces/:id` — Delete workspace
- `POST /api/workspaces/:id/members` — Add member
- `DELETE /api/workspaces/:id/members/:userId` — Remove member

### Spaces, Folders, Lists, Tasks, Comments
Full CRUD endpoints. See backend source for complete API reference.

## 🎨 Features

- **4 Views**: List, Board (Kanban), Calendar, Table
- **Task Detail**: Inline editing, status, priority, assignees, due dates, tags, subtasks, comments
- **Real-time**: Socket.io events for task/comment updates
- **Auth**: JWT with refresh token rotation
- **Workspace Management**: Members, roles (Owner/Admin/Member)
- **Dark Theme**: Black & Blue palette throughout

## 📁 Project Structure

```
/
├── frontend/          # React + Vite + TypeScript
├── backend/           # Node.js + Express + TypeScript
│   └── prisma/        # Database schema & migrations
├── docker-compose.yml
└── README.md
```