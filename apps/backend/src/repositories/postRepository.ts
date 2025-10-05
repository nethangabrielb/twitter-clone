import { prisma } from '../prisma/client';
import { Post } from '../types/post';

const postRepository = {
  create: (data: Post) => prisma.post.create({ data }),
};

export default postRepository;
