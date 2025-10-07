import { Request, Response } from 'express';

import likeService from '../../services/likeService';
import { Like } from '../../types/like';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const likesController = (() => {
  const createLike = async (
    req: Request<object, object, Like>,
    res: Response
  ) => {
    try {
      const like = await likeService.createLike(req.body);

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

  return { createLike };
})();

export default likesController;
