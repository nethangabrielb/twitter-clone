import { prisma } from '../prisma/client';
import { Post } from '../types/post';

const postRepository = {
  create: (data: Post) => prisma.post.create({ data }),
  findById: (id: number) => prisma.post.findUnique({ where: { id } }),
  findAll: () => prisma.post.findMany(),
  deleteById: (id: number) => prisma.post.delete({ where: { id } }),
};

export default postRepository;
