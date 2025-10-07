import likeRepository from '../repositories/likeRepository';
import { Like } from '../types/like';
import { User } from '../types/user';

const likeService = {
  createLike: async (data: Like) => {
    const like = await likeRepository.create(data);
    if (!like) throw new Error('There was an issue liking post.');
    return like;
  },
  deleteLike: async (postId: number, user: User) => {
    return likeRepository.deleteByIds({ postId, userId: user.id });
  },
};

export default likeService;
