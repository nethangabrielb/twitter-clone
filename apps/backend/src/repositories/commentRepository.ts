import { prisma } from '../prisma/client';
import { CommentBody } from '../types/comment';

const commentRepository = {
  create: (data: CommentBody) => prisma.comment.create({ data }),
  findById: (id: number) => prisma.comment.findUnique({ where: { id } }),
};

export default commentRepository;
