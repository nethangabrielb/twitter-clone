import { prisma } from '../prisma/client';
import { Like } from '../types/like';

const likeRepository = {
  create: (data: Like) => prisma.like.create({ data }),
};

export default likeRepository;
