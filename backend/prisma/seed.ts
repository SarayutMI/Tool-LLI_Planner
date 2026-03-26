import { PrismaClient, TaskPriority, MemberRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      password: passwordHash,
      name: 'Demo User',
    },
  });

  const workspace = await prisma.workspace.upsert({
    where: { id: 'demo-workspace-id' },
    update: {},
    create: {
      id: 'demo-workspace-id',
      name: 'Demo Workspace',
      color: '#0075ff',
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: MemberRole.OWNER,
        },
      },
    },
  });

  const space = await prisma.space.create({
    data: {
      name: 'My Space',
      color: '#7c3aed',
      workspaceId: workspace.id,
      members: {
        create: { userId: user.id },
      },
    },
  });

  const folder = await prisma.folder.create({
    data: {
      name: 'Development',
      color: '#0075ff',
      spaceId: space.id,
    },
  });

  const list = await prisma.list.create({
    data: {
      name: 'Sprint 1',
      color: '#0075ff',
      folderId: folder.id,
      spaceId: space.id,
    },
  });

  await prisma.task.createMany({
    data: [
      {
        title: 'Set up project structure',
        description: 'Initialize the project with all required dependencies.',
        status: 'Done',
        priority: TaskPriority.HIGH,
        listId: list.id,
        order: 0,
      },
      {
        title: 'Design database schema',
        description: 'Create Prisma schema for all entities.',
        status: 'In Progress',
        priority: TaskPriority.HIGH,
        listId: list.id,
        order: 1,
      },
      {
        title: 'Implement authentication',
        description: 'JWT-based auth with access and refresh tokens.',
        status: 'To Do',
        priority: TaskPriority.URGENT,
        listId: list.id,
        order: 2,
      },
    ],
  });

  console.log('Seed completed:', { userId: user.id, workspaceId: workspace.id });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
