import { prisma } from '../prisma/client';
import { Post } from '../types/post';

const postRepository = {
  create: (data: Post) => prisma.post.create({ data }),
  findById: (id: number) =>
    prisma.post.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            Like: true,
          },
        },
        Comment: {
          include: {
            _count: {
              select: {
                Like: true,
              },
            },
          },
        },
      },
    }),
  findAll: () =>
    prisma.post.findMany({
      include: {
        _count: {
          select: {
            Like: true,
          },
        },
      },
    }),
  deleteById: (id: number) => prisma.post.delete({ where: { id } }),
};

export default postRepository;
