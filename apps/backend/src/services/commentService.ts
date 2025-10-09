import commentRepository from '../repositories/commentRepository';
import { CommentBody } from '../types/comment';

const commentService = {
  createComment: async (data: CommentBody) => {
    const comment = await commentRepository.create(data);
    if (!comment) throw new Error('There was an issue creating comment');
    return comment;
  },
  getComment: async (commentId: number) => {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new Error('Comment not found');
    return comment;
  },
};

export default commentService;
