import likeRepository from '../repositories/likeRepository';
import { Like } from '../types/like';

const likeService = {
  createLike: async (data: Like) => {
    const like = await likeRepository.create(data);
    if (!like) throw new Error('There was an issue liking post.');
    return like;
  },
};

export default likeService;
