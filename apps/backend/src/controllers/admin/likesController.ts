import { Request, Response } from 'express';

import {
  commentLikeService,
  postLikeService,
} from '../../services/likeService';
import { User } from '../../types/user';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const postLikesController = (() => {
  const createLike = async (
    req: Request<{ postId: number }, object, object>,
    res: Response
  ) => {
    try {
      const like = await postLikeService.createLike(
        Number(req.params.postId),
        req.user as User
      );

      res.json({
        status: 'success',
        message: 'Post liked successfully',
        data: like,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const deleteLike = async (
    req: Request<{ postId: number }, object, object>,
    res: Response
  ) => {
    try {
      await postLikeService.deleteLike(
        Number(req.params.postId),
        req.user as User
      );

      res.json({
        status: 'success',
        message: 'Unlike success',
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { createLike, deleteLike };
})();

const commentLikesController = (() => {
  const createLike = async (
    req: Request<{ commentId: number }, object, object>,
    res: Response
  ) => {
    try {
      const like = await commentLikeService.createLike(
        Number(req.params.commentId),
        req.user as User
      );

      res.json({
        status: 'success',
        message: 'Post liked successfully',
        data: like,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const deleteLike = async (
    req: Request<{ commentId: number }, object, object>,
    res: Response
  ) => {
    try {
      await commentLikeService.deleteLike(
        Number(req.params.commentId),
        req.user as User
      );

      res.json({
        status: 'success',
        message: 'Unlike success',
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { createLike, deleteLike };
})();

export { postLikesController, commentLikesController };
