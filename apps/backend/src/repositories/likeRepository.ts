import { prisma } from '../prisma/client.ts';
import { PostLike } from '../types/like.ts';

const postLikeRepository = {
  create: (data: PostLike) => prisma.postLike.create({ data }),
  deleteByIds: (data: PostLike) =>
    prisma.postLike.delete({
      where: {
        userId_postId: {
          userId: data.userId,
          postId: data.postId,
        },
      },
    }),
};

export { postLikeRepository };
