import { prisma } from '../prisma/client';
import { Like } from '../types/like';

const likeRepository = {
  create: (data: Like) => prisma.like.create({ data }),
  deleteByIds: (data: Like) =>
    prisma.like.delete({
      where: {
        userId_postId: {
          userId: data.userId,
          postId: data.postId,
        },
      },
    }),
};

export default likeRepository;
