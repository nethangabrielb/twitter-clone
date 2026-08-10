import { describe, expect, it, vi } from 'vitest';

const { createMessageMock, getRoomForUserMock } = vi.hoisted(() => ({
  createMessageMock: vi.fn(),
  getRoomForUserMock: vi.fn(),
}));

vi.mock('../src/repositories/messageRepository.ts', () => ({
  default: {
    create: createMessageMock,
    findByRoomId: vi.fn(),
    updateByRoomId: vi.fn(),
  },
}));

vi.mock('../src/services/roomService.ts', () => ({
  default: { getRoomForUser: getRoomForUserMock },
}));

import messageService from '../src/services/messageService.ts';

const AUTH_USER = 7;
const OTHER_USER = 2;
const SPOOFED_USER = 999;

const baseData = {
  roomId: 5,
  senderId: SPOOFED_USER,
  receiverId: OTHER_USER,
  content: 'hello',
  unread: true,
};

describe('messageService.sendMessage', () => {
  it('ignores a spoofed senderId in the payload and uses the authenticated user id', async () => {
    getRoomForUserMock.mockResolvedValue({
      id: 5,
      users: [{ id: AUTH_USER }, { id: OTHER_USER }],
    });
    createMessageMock.mockResolvedValue({ id: 1 });

    await messageService.sendMessage(AUTH_USER, baseData as never);

    expect(createMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        senderId: AUTH_USER,
        receiverId: OTHER_USER,
        roomId: 5,
      })
    );
  });

  it('rejects when the sender is not a member of the room', async () => {
    getRoomForUserMock.mockResolvedValue(null);

    await expect(
      messageService.sendMessage(AUTH_USER, baseData as never)
    ).rejects.toThrow('You are not a member of this room.');
    expect(createMessageMock).not.toHaveBeenCalled();
  });

  it('falls back to the real room member when the payload receiverId is not in the room', async () => {
    getRoomForUserMock.mockResolvedValue({
      id: 5,
      users: [{ id: AUTH_USER }, { id: OTHER_USER }],
    });
    createMessageMock.mockResolvedValue({ id: 1 });

    await messageService.sendMessage(AUTH_USER, {
      ...baseData,
      receiverId: 88888,
    } as never);

    expect(createMessageMock).toHaveBeenCalledWith(
      expect.objectContaining({
        senderId: AUTH_USER,
        receiverId: OTHER_USER,
      })
    );
  });

  it('rejects when the room has no other members', async () => {
    getRoomForUserMock.mockResolvedValue({ id: 5, users: [{ id: AUTH_USER }] });

    await expect(
      messageService.sendMessage(AUTH_USER, baseData as never)
    ).rejects.toThrow('Invalid room.');
    expect(createMessageMock).not.toHaveBeenCalled();
  });
});
