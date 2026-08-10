import { describe, expect, it, vi } from 'vitest';

const { getRoomForUserMock, getByRoomIdMock, patchMessagesUnreadStatusMock } =
  vi.hoisted(() => ({
    getRoomForUserMock: vi.fn(),
    getByRoomIdMock: vi.fn(),
    patchMessagesUnreadStatusMock: vi.fn(),
  }));

vi.mock('../src/services/roomService.ts', () => ({
  default: {
    createRoom: vi.fn(),
    getUserRooms: vi.fn(),
    getRoomForUser: getRoomForUserMock,
  },
}));

vi.mock('../src/services/messageService.ts', () => ({
  default: {
    createMessage: vi.fn(),
    sendMessage: vi.fn(),
    getByRoomId: getByRoomIdMock,
    patchMessagesUnreadStatus: patchMessagesUnreadStatusMock,
  },
}));

import messageController from '../src/controllers/admin/messagesController.ts';
import { createReq, createRes } from './helpers.ts';

describe('messageController.getMessages', () => {
  it('rejects when the authenticated user is not a member of the room', async () => {
    getRoomForUserMock.mockResolvedValue(null);
    const req = createReq({ params: { roomId: '5' }, user: { id: 1 } });
    const res = createRes();

    await messageController.getMessages(req as never, res as never);

    expect(getByRoomIdMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns messages when the user is a member of the room', async () => {
    getRoomForUserMock.mockResolvedValue({ id: 5, users: [{ id: 1 }, { id: 2 }] });
    getByRoomIdMock.mockResolvedValue([{ id: 10 }]);
    const req = createReq({ params: { roomId: '5' }, user: { id: 1 } });
    const res = createRes();

    await messageController.getMessages(req as never, res as never);

    expect(getRoomForUserMock).toHaveBeenCalledWith(1, 5);
    expect(getByRoomIdMock).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success' })
    );
  });

  it('rejects guests', async () => {
    const req = createReq({
      params: { roomId: '5' },
      user: { id: 999999999, isGuest: true },
    });
    const res = createRes();

    await messageController.getMessages(req as never, res as never);

    expect(res.status).toHaveBeenCalledWith(403);
  });
});

describe('messageController.patchMessages', () => {
  it('rejects when the authenticated user is not a member of the room', async () => {
    getRoomForUserMock.mockResolvedValue(null);
    const req = createReq({ params: { roomId: '5' }, user: { id: 1 } });
    const res = createRes();

    await messageController.patchMessages(req as never, res as never);

    expect(patchMessagesUnreadStatusMock).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('marks messages read when the user is a member of the room', async () => {
    getRoomForUserMock.mockResolvedValue({ id: 5, users: [{ id: 1 }, { id: 2 }] });
    patchMessagesUnreadStatusMock.mockResolvedValue([{ id: 10 }]);
    const req = createReq({ params: { roomId: '5' }, user: { id: 1 } });
    const res = createRes();

    await messageController.patchMessages(req as never, res as never);

    expect(getRoomForUserMock).toHaveBeenCalledWith(1, 5);
    expect(patchMessagesUnreadStatusMock).toHaveBeenCalledWith(5);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ status: 'success' })
    );
  });
});
