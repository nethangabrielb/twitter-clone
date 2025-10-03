import followRepository from '../repositories/followRepository';
import type { Follow } from '../types/follow';

const FollowService = {
  createNewFollow: async (follow: Follow) => {
    const newFollow = await followRepository.create(follow);
    if (!newFollow) {
      throw new Error('Error following user. Please try again');
    }
    return newFollow;
  },
};

export default FollowService;
