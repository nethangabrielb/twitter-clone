import { describe, expect, it, vi } from 'vitest';

const { createRoomMock } = vi.hoisted(() => ({
  createRoomMock: vi.fn(),
}));

vi.mock('../src/services/roomService.ts', () => ({
  default: { createRoom: createRoomMock, getUserRooms: vi.fn() },
}));

import roomController from '../src/controllers/admin/roomController.ts';
import { createReq, createRes } from './helpers.ts';

const otherUser = {
  id: 2,
  name: 'Other',
  username: 'other',
  email: 'other@example.com',
  password: '',
  onboarded: true,
};

describe('roomController.createRoom', () => {
  it('rejects when the authenticated user is not one of the room members', async () => {
    const req = createReq({
      body: { users: [otherUser, { ...otherUser, id: 3 }] },
      user: { id: 7 },
    });
    const res = createRes();

    await roomController.createRoom(req as never, res as never);

    expect(createRoomMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('creates the room when the authenticated user is a member', async () => {
    createRoomMock.mockResolvedValue({ id: 1 });
    const req = createReq({
      body: {
        users: [
          { ...otherUser, id: 7, name: 'Me', username: 'me' },
          otherUser,
        ],
      },
      user: { id: 7 },
    });
    const res = createRes();

    await roomController.createRoom(req as never, res as never);

    expect(createRoomMock).toHaveBeenCalledWith(
      expect.objectContaining({ users: expect.any(Array) })
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success' })
    );
  });
});
