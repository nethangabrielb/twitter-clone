import commentRepository from '../repositories/commentRepository';
import postRepository from '../repositories/postRepository';
import { CommentBody } from '../types/comment';

const commentService = {
  createComment: async (data: CommentBody) => {
    // Find the post it is replying to
    const post = await postRepository.findById(data.replyId);

    if (post?.deleted) {
      return 'deleted';
    }

    const comment = await commentRepository.create(data);
    if (!comment) throw new Error('There was an issue creating comment');
    return comment;
  },
  getComment: async (commentId: number) => {
    const comment = await commentRepository.findById(commentId);
    if (!comment) throw new Error('Comment not found');
    return comment;
  },
  deleteComment: async (commentId: number) => {
    return commentRepository.deleteById(commentId);
  },
};

export default commentService;
