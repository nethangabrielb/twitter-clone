import { Request, Response } from 'express';

import FollowService from '../../services/followService.ts';
import type { Follow } from '../../types/follow.ts';
import type { User } from '../../types/user.ts';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage.ts';

const followsController = (() => {
  const createFollow = async (
    req: Request<object, object, Follow>,
    res: Response
  ) => {
    try {
      const user = req.user as User;
      const followingId = Number(req.body.followingId);

      if (followingId === user.id) {
        res.status(400).json({
          status: 'error',
          message: 'A user cannot follow itself',
        });
        return;
      }

      // always derive the follower from the authenticated session,
      // never trust a followerId sent by the client
      const follow = await FollowService.createNewFollow({
        followerId: user.id,
        followingId,
      });
      res.json({
        status: 'success',
        message: 'Follow success',
        data: follow,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getFollowers = async (
    req: Request<{ userId: string }, object, object>,
    res: Response
  ) => {
    try {
      const follow = await FollowService.getUserFollowers(
        Number(req.params.userId)
      );

      res.status(200).json({
        status: 'success',
        message: 'User followers fetched successfully',
        data: follow,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getFollowings = async (
    req: Request<{ userId: string }, object, object>,
    res: Response
  ) => {
    try {
      const follow = await FollowService.getUserFollowings(
        Number(req.params.userId)
      );

      res.status(200).json({
        status: 'success',
        message: 'User followings fetched successfully',
        data: follow,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const deleteFollow = async (
    req: Request<{ followId: string }, object, object>,
    res: Response
  ) => {
    try {
      const user = req.user as User;
      const follow = await FollowService.getFollowById(
        Number(req.params.followId)
      );

      if (follow.followerId !== user.id) {
        throw new Error('You are unauthorized to perform this action.');
      }

      await FollowService.deleteFollow(Number(req.params.followId));

      res.json({
        status: 'success',
        message: 'Remove follow success',
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { createFollow, getFollowers, getFollowings, deleteFollow };
})();

export default followsController;
