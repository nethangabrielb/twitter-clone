import { Request, Response } from 'express';

import commentService from '../../services/commentService';
import { CommentBody } from '../../types/comment';
import { User } from '../../types/user';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const commentsController = (() => {
  const createComment = async (
    req: Request<object, object, CommentBody>,
    res: Response
  ) => {
    try {
      const user = req.user as User;
      const data = {
        userId: user.id,
        postId: Number(req.body.postId),
        content: req.body.content,
      };
      const comment = await commentService.createComment(data);

      res.json({
        status: 'success',
        message: 'Comment created successfully!',
        data: comment,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getComment = async (
    req: Request<{ commentId: string }, object, object>,
    res: Response
  ) => {
    try {
      const comment = await commentService.getComment(
        Number(req.params.commentId)
      );

      res.json({
        status: 'success',
        data: comment,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const deleteComment = async (
    req: Request<{ commentId: string }, object, object>,
    res: Response
  ) => {
    try {
      await commentService.deleteComment(Number(req.params.commentId));

      res.json({
        status: 'success',
        message: 'Comment deleted successfully',
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { createComment, getComment, deleteComment };
})();

export default commentsController;
