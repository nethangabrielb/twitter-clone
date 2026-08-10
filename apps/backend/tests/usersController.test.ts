import { describe, expect, it, vi } from 'vitest';

const { deleteUserMock, updateUserMock, getUserByIdMock } = vi.hoisted(() => ({
  deleteUserMock: vi.fn(),
  updateUserMock: vi.fn(),
  getUserByIdMock: vi.fn(),
}));

vi.mock('../src/services/userService.ts', () => ({
  default: {
    createNewUser: vi.fn(),
    loginUser: vi.fn(),
    getUserById: getUserByIdMock,
    getAllUsers: vi.fn(),
    getUserChatList: vi.fn(),
    getUserSearchResults: vi.fn(),
    updateUser: updateUserMock,
    deleteUser: deleteUserMock,
    getUserByUsername: vi.fn(),
    getUserByEmail: vi.fn(),
    getFollowLists: vi.fn(),
    getFollowListsLimit: vi.fn(),
  },
}));

vi.mock('../src/services/roomService.ts', () => ({
  default: { createRoom: vi.fn(), getUserRooms: vi.fn() },
}));

vi.mock('../src/repositories/followRepository.ts', () => ({
  default: {
    create: vi.fn(),
    findFollowings: vi.fn(),
    findFollowers: vi.fn(),
    deleteById: vi.fn(),
    findById: vi.fn(),
  },
}));

import usersController from '../src/controllers/admin/usersController.ts';
import { createReq, createRes } from './helpers.ts';

describe('usersController.deleteUser', () => {
  it('deletes the user when the authenticated user owns the account', async () => {
    deleteUserMock.mockResolvedValue({ id: 5 });
    const req = createReq({ params: { id: '5' }, user: { id: 5 } });
    const res = createRes();

    await usersController.deleteUser(req as never, res as never);

    expect(deleteUserMock).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success' })
    );
  });

  it('rejects when the authenticated user tries to delete another account', async () => {
    const req = createReq({ params: { id: '99' }, user: { id: 5 } });
    const res = createRes();

    await usersController.deleteUser(req as never, res as never);

    expect(deleteUserMock).not.toHaveBeenCalled();
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'error',
        message: 'You are unauthorized to perform this action.',
      })
    );
  });
});
