import { prisma } from '../prisma/client';
import type { Follow } from '../types/follow';

const followRepository = {
  create: (data: Follow) => prisma.follow.create({ data }),
  getFollowings: async (userId: number) =>
    await prisma.follow.findMany({
      where: {
        followerId: userId,
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    }),
  getFollowers: async (userId: number) =>
    await prisma.follow.findMany({
      where: {
        followingId: userId,
      },
      select: {
        follower: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          },
        },
      },
    }),
  deleteById: async (followId: number) => {
    await prisma.follow.delete({
      where: {
        id: followId,
      },
    });
  },
};

export default followRepository;
