import followRepository from '../repositories/followRepository';
import type { Follow } from '../types/follow';
import type { User } from '../types/user';

const FollowService = {
  createNewFollow: async (follow: Follow) => {
    const newFollow = await followRepository.create(follow);
    if (!newFollow) {
      throw new Error('Error following user. Please try again');
    }
    return newFollow;
  },
  getUserFollows: async (userId: number) => {
    const followings: Array<{ following: Partial<User> }> =
      await followRepository.getFollowings(userId);

    const followers: Array<{ follower: Partial<User> }> =
      await followRepository.getFollowers(userId);

    if (!followings || !followers) {
      throw new Error(
        'There was an error fetching data in the database. Please try again'
      );
    }
    return { followers, followings };
  },
  // deleteFollow: () => {},
};

export default FollowService;
