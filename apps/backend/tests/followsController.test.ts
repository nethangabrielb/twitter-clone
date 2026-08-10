import { describe, expect, it, vi } from 'vitest';

const { createNewFollowMock, deleteFollowMock, getFollowByIdMock } =
  vi.hoisted(() => ({
    createNewFollowMock: vi.fn(),
    deleteFollowMock: vi.fn(),
    getFollowByIdMock: vi.fn(),
  }));

vi.mock('../src/services/followService.ts', () => ({
  default: {
    createNewFollow: createNewFollowMock,
    getUserFollows: vi.fn(),
    getUserFollowers: vi.fn(),
    getUserFollowings: vi.fn(),
    deleteFollow: deleteFollowMock,
    getFollowById: getFollowByIdMock,
  },
}));

import followsController from '../src/controllers/admin/followsController.ts';
import { createReq, createRes } from './helpers.ts';

describe('followsController.createFollow', () => {
  it('always uses the authenticated user as the follower, ignoring any followerId in the body', async () => {
    createNewFollowMock.mockResolvedValue({
      followerId: 7,
      followingId: 42,
    });
    const req = createReq({
      body: { followerId: 999, followingId: 42 },
      user: { id: 7 },
    });
    const res = createRes();

    await followsController.createFollow(req as never, res as never);

    expect(createNewFollowMock).toHaveBeenCalledWith({
      followerId: 7,
      followingId: 42,
    });
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success' })
    );
  });

  it('rejects self-follow attempts with 400', async () => {
    const req = createReq({
      body: { followerId: 7, followingId: 7 },
      user: { id: 7 },
    });
    const res = createRes();

    await followsController.createFollow(req as never, res as never);

    expect(createNewFollowMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(400);
  });
});

describe('followsController.deleteFollow', () => {
  it('rejects when the authenticated user does not own the follow record', async () => {
    getFollowByIdMock.mockResolvedValue({ id: 4, followerId: 1 });
    const req = createReq({ params: { followId: '4' }, user: { id: 2 } });
    const res = createRes();

    await followsController.deleteFollow(req as never, res as never);

    expect(deleteFollowMock).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'You are unauthorized to perform this action.',
      })
    );
  });

  it('deletes the follow when the authenticated user owns it', async () => {
    getFollowByIdMock.mockResolvedValue({ id: 4, followerId: 2 });
    deleteFollowMock.mockResolvedValue(undefined);
    const req = createReq({ params: { followId: '4' }, user: { id: 2 } });
    const res = createRes();

    await followsController.deleteFollow(req as never, res as never);

    expect(deleteFollowMock).toHaveBeenCalledWith(4);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success' })
    );
  });
});
