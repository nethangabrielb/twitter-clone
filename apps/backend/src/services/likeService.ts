import {
  commentLikeRepository,
  postLikeRepository,
} from '../repositories/likeRepository';
import { User } from '../types/user';

const postLikeService = {
  createLike: async (postId: number, user: User) => {
    const like = await postLikeRepository.create({ postId, userId: user.id });
    if (!like) throw new Error('There was an issue liking post.');
    return like;
  },
  deleteLike: async (postId: number, user: User) => {
    return postLikeRepository.deleteByIds({ postId, userId: user.id });
  },
};

const commentLikeService = {
  createLike: async (commentId: number, user: User) => {
    const like = await commentLikeRepository.create({
      commentId,
      userId: user.id,
    });
    if (!like) throw new Error('There was an issue liking post.');
    return like;
  },
  deleteLike: async (commentId: number, user: User) => {
    return commentLikeRepository.deleteByIds({ commentId, userId: user.id });
  },
};

export { postLikeService, commentLikeService };
