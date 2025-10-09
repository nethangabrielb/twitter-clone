import { prisma } from '../prisma/client';
import { CommentBody } from '../types/comment';

const commentRepository = {
  create: (data: CommentBody) => prisma.comment.create({ data }),
  findById: (id: number) =>
    prisma.comment.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            Like: true,
          },
        },
      },
    }),
  deleteById: (id: number) =>
    prisma.comment.update({ where: { id }, data: { deleted: true } }),
};

export default commentRepository;
