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
            replies: {
              where: {
                deleted: false,
              },
            },
          },
        },
        user: {
          select: {
            avatar: true,
            username: true,
            name: true,
          },
        },
        Like: {
          select: {
            userId: true,
          },
        },
        replies: {
          include: {
            _count: {
              select: {
                Like: true,
                replies: {
                  where: {
                    deleted: false,
                  },
                },
              },
            },
            user: {
              select: {
                avatar: true,
                username: true,
                name: true,
              },
            },
            Like: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    }),
  findAll: () =>
    prisma.post.findMany({
      where: {
        deleted: false,
        replyId: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: {
            Like: true,
            replies: {
              where: {
                deleted: false,
              },
            },
          },
        },
        user: {
          select: {
            avatar: true,
            username: true,
            name: true,
          },
        },
        Like: {
          select: {
            userId: true,
          },
        },
        replies: {
          include: {
            _count: {
              select: {
                Like: true,
                replies: {
                  where: {
                    deleted: false,
                  },
                },
              },
            },
            user: {
              select: {
                avatar: true,
                username: true,
                name: true,
              },
            },
            Like: {
              select: {
                userId: true,
              },
            },
          },
        },
      },
    }),
  deleteById: (id: number) =>
    prisma.post.update({ where: { id }, data: { deleted: true } }),
};

export default postRepository;
