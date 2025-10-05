import { prisma } from '../prisma/client';
import { Post } from '../types/post';

const postRepository = {
  create: (data: Post) => prisma.post.create({ data }),
  get: (id: number) => prisma.post.findUnique({ where: { id } }),
};

export default postRepository;
