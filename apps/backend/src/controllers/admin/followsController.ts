import { Request, Response } from 'express';

import FollowService from '../../services/followService';
import type { Follow } from '../../types/follow';

const followsController = (() => {
  const createFollow = async (
    req: Request<object, object, Follow>,
    res: Response
  ) => {
    try {
      const follow = await FollowService.createNewFollow(req.body);

      res.status(200).json({
        status: 'success',
        message: 'Follow success',
        data: follow,
      });
    } catch (e: unknown) {
      res.status(500).json({
        status: 'error',
        message:
          e instanceof Error
            ? e.message
            : 'There was a problem with the server',
      });
    }
  };

  const getFollows = async (
    req: Request<{ userId: string }, object, object>,
    res: Response
  ) => {
    try {
      const follow = await FollowService.getUserFollows(
        Number(req.params.userId)
      );

      res.status(200).json({
        status: 'success',
        message: 'Follow success',
        data: follow,
      });
    } catch (e: unknown) {
      res.status(500).json({
        status: 'error',
        message:
          e instanceof Error
            ? e.message
            : 'There was a problem with the server',
      });
    }
  };

  const deleteFollow = async (
    req: Request<{ followId: string }, object, object>,
    res: Response
  ) => {
    try {
      await FollowService.deleteFollow(Number(req.params.followId));

      res.status(200).json({
        status: 'success',
        message: 'Remove follow success',
      });
    } catch (e: unknown) {
      res.status(500).json({
        status: 'error',
        message:
          e instanceof Error
            ? e.message
            : 'There was a problem with the server',
      });
    }
  };

  return { createFollow, getFollows, deleteFollow };
})();

export default followsController;
