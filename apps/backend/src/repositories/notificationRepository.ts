import { prisma } from '../prisma/client.ts';
import { NotificationBody } from '../types/notification.ts';

const notificationRepository = {
  create: (data: NotificationBody) =>
    prisma.notification.create({
      data,
      include: {
        sender: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        post: {
          select: { content: true, deleted: true },
        },
      },
    }),
  findAll: (receiverId: number) =>
    prisma.notification.findMany({
      where: { receiverId: receiverId },
      include: {
        sender: {
          select: { id: true, name: true, username: true, avatar: true },
        },
        post: {
          select: { content: true, deleted: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    }),
};

export default notificationRepository;
