import { postLikeRepository } from '../repositories/likeRepository.ts';
import { User } from '../types/user.ts';

const postLikeService = {
  createLike: async (postId: number, user: User) => {
    const like = await postLikeRepository.create({ postId, userId: user?.id });
    if (!like) throw new Error('There was an issue liking post.');
    return like;
  },
  deleteLike: async (postId: number, user: User) => {
    return postLikeRepository.deleteByIds({ postId, userId: user?.id });
  },
};

export { postLikeService };
