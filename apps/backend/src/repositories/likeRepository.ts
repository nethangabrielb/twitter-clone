import { prisma } from '../prisma/client';
import { CommentLike, PostLike } from '../types/like';

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

const commentLikeRepository = {
  create: (data: CommentLike) => prisma.commentLike.create({ data }),
  deleteByIds: (data: CommentLike) =>
    prisma.commentLike.delete({
      where: {
        userId_commentId: {
          userId: data.userId,
          commentId: data.commentId,
        },
      },
    }),
};

export { postLikeRepository, commentLikeRepository };
