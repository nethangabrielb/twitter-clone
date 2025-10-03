import { prisma } from '../prisma/client';
import type { Follow } from '../types/follow';

const followRepository = {
  create: (data: Follow) => prisma.follow.create({ data }),
};

export default followRepository;
