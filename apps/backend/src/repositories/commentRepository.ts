import { prisma } from '../prisma/client';
import { CommentBody } from '../types/comment';

const commentRepository = {
  create: (data: CommentBody) => prisma.post.create({ data }),
  findById: (id: number) =>
    prisma.post.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            Like: true,
            replies: true,
          },
        },
      },
    }),
  deleteById: (id: number) =>
    prisma.post.update({ where: { id }, data: { deleted: true } }),
};

export default commentRepository;
