import likeRepository from '../repositories/likeRepository';
import { User } from '../types/user';

const likeService = {
  createLike: async (postId: number, user: User) => {
    const like = await likeRepository.create({ postId, userId: user.id });
    if (!like) throw new Error('There was an issue liking post.');
    return like;
  },
  deleteLike: async (postId: number, user: User) => {
    return likeRepository.deleteByIds({ postId, userId: user.id });
  },
};

export default likeService;
