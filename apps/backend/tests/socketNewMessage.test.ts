import { describe, expect, it, vi } from 'vitest';

const { sendMessageMock, getRoomForUserMock } = vi.hoisted(() => ({
  sendMessageMock: vi.fn(),
  getRoomForUserMock: vi.fn(),
}));

vi.mock('../src/services/messageService.ts', () => ({
  default: {
    sendMessage: sendMessageMock,
    createMessage: vi.fn(),
    getByRoomId: vi.fn(),
    patchMessagesUnreadStatus: vi.fn(),
  },
}));

vi.mock('../src/services/roomService.ts', () => ({
  default: {
    getRoomForUser: getRoomForUserMock,
    getUserRooms: vi.fn(),
    createRoom: vi.fn(),
  },
}));

vi.mock('../src/repositories/notificationRepository.ts', () => ({
  default: { create: vi.fn(), findAll: vi.fn() },
}));

import notificationRepository from '../src/repositories/notificationRepository.ts';
import { initSocket } from '../src/sockets/index.ts';

const AUTH_USER = 7;
const OTHER_USER = 2;
const SPOOFED_USER = 999;

const payload = {
  roomId: 5,
  senderId: SPOOFED_USER,
  receiverId: OTHER_USER,
  content: 'hello',
  unread: true,
};

const setup = () => {
  const io = { use: vi.fn(), on: vi.fn() };
  let connectionHandler: unknown;
  io.on.mockImplementation((event: string, handler: unknown) => {
    if (event === 'connection') connectionHandler = handler;
    return io;
  });

  const eventHandlers: Record<string, (...args: never[]) => void> = {};
  const emitToRoom = vi.fn();
  const broadcastEmit = vi.fn();
  const emit = vi.fn();
  const socket = {
    data: { userId: AUTH_USER },
    on: vi.fn((event: string, handler: (...args: never[]) => void) => {
      eventHandlers[event] = handler;
    }),
    to: vi.fn(() => ({ emit: emitToRoom })),
    broadcast: { emit: broadcastEmit },
    emit,
    join: vi.fn(),
    leave: vi.fn(),
  };

  initSocket(io as never);
  (connectionHandler as (socket: unknown) => void)(socket);

  return { eventHandlers, emitToRoom, broadcastEmit, socket };
};

const notificationUser = { id: AUTH_USER, name: 'Alice', username: 'alice' };

describe('socket newMessage handler', () => {
  it('uses the socket authenticated user as the sender, ignoring a spoofed payload senderId', async () => {
    sendMessageMock.mockResolvedValue({
      id: 1,
      roomId: 5,
      receiverId: OTHER_USER,
      senderId: AUTH_USER,
      content: 'hello',
      unread: true,
    });
    const { eventHandlers, emitToRoom, broadcastEmit } = setup();
    const callback = vi.fn();

    await eventHandlers['newMessage'](payload, AUTH_USER, callback);

    // handler passes the socket user id, not the payload's senderId
    expect(sendMessageMock).toHaveBeenCalledWith(AUTH_USER, payload);
    expect(callback).toHaveBeenCalledWith({
      success: true,
      message: expect.any(Object),
    });
    expect(emitToRoom).toHaveBeenCalledWith('newMessage', expect.any(Object));
    expect(broadcastEmit).toHaveBeenCalledWith(
      'newMessageNotification',
      OTHER_USER
    );
  });

  it('returns an error callback and does not emit when the user is not a member of the room', async () => {
    sendMessageMock.mockRejectedValue(
      new Error('You are not a member of this room.')
    );
    const { eventHandlers, emitToRoom, broadcastEmit } = setup();
    const callback = vi.fn();

    await eventHandlers['newMessage'](payload, AUTH_USER, callback);

    expect(callback).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    );
    expect(emitToRoom).not.toHaveBeenCalled();
    expect(broadcastEmit).not.toHaveBeenCalled();
  });

  it('does not send when the client-supplied sender argument does not match the socket user', async () => {
    const { eventHandlers, emitToRoom } = setup();
    const callback = vi.fn();

    await eventHandlers['newMessage'](payload, SPOOFED_USER, callback);

    expect(sendMessageMock).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
    expect(emitToRoom).not.toHaveBeenCalled();
  });

  it('does not crash when sendMessage resolves null (DB error) — clean error instead of a TypeError', async () => {
    sendMessageMock.mockResolvedValue(null);
    const { eventHandlers, emitToRoom, broadcastEmit } = setup();
    const callback = vi.fn();

    await eventHandlers['newMessage'](payload, AUTH_USER, callback);

    expect(callback).toHaveBeenCalledWith({
      success: false,
      message: 'There was an error sending the message.',
    });
    expect(emitToRoom).not.toHaveBeenCalled();
    expect(broadcastEmit).not.toHaveBeenCalled();
  });
});

describe('socket joinRoom/leaveRoom handlers', () => {
  it('joins the room and acks when the user is a member', async () => {
    getRoomForUserMock.mockResolvedValue({
      id: 5,
      users: [{ id: AUTH_USER }, { id: OTHER_USER }],
    });
    const { eventHandlers, socket } = setup();
    const callback = vi.fn();

    await eventHandlers['joinRoom']('5', AUTH_USER, callback);

    expect(getRoomForUserMock).toHaveBeenCalledWith(AUTH_USER, 5);
    expect(socket.join).toHaveBeenCalledWith('5');
    expect(callback).toHaveBeenCalledWith({ status: 'ok' });
  });

  it('does not join when the user is not a member of the room', async () => {
    getRoomForUserMock.mockResolvedValue(null);
    const { eventHandlers, socket } = setup();
    const callback = vi.fn();

    await eventHandlers['joinRoom']('5', AUTH_USER, callback);

    expect(socket.join).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('leaves the room and acks when the user is a member', async () => {
    getRoomForUserMock.mockResolvedValue({
      id: 5,
      users: [{ id: AUTH_USER }, { id: OTHER_USER }],
    });
    const { eventHandlers, socket } = setup();
    const callback = vi.fn();

    await eventHandlers['leaveRoom']('5', AUTH_USER, callback);

    expect(socket.leave).toHaveBeenCalledWith('5');
    expect(callback).toHaveBeenCalledWith({ status: 'ok' });
  });

  it('does not leave when the user is not a member of the room', async () => {
    getRoomForUserMock.mockResolvedValue(null);
    const { eventHandlers, socket } = setup();
    const callback = vi.fn();

    await eventHandlers['leaveRoom']('5', AUTH_USER, callback);

    expect(socket.leave).not.toHaveBeenCalled();
    expect(callback).not.toHaveBeenCalled();
  });

  it('emits a socketError and error ack when the room lookup throws (DB error) — joinRoom stays up', async () => {
    getRoomForUserMock.mockRejectedValue(new Error('database unavailable'));
    const { eventHandlers, socket } = setup();
    const callback = vi.fn();

    await eventHandlers['joinRoom']('5', AUTH_USER, callback);

    expect(socket.join).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith({
      status: 'error',
      message: 'database unavailable',
    });
    expect(socket.emit).toHaveBeenCalledWith('socketError', {
      event: 'joinRoom',
      message: 'database unavailable',
    });
  });

  it('emits a socketError and error ack when the room lookup throws (DB error) — leaveRoom stays up', async () => {
    getRoomForUserMock.mockRejectedValue(new Error('database unavailable'));
    const { eventHandlers, socket } = setup();
    const callback = vi.fn();

    await eventHandlers['leaveRoom']('5', AUTH_USER, callback);

    expect(socket.leave).not.toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith({
      status: 'error',
      message: 'database unavailable',
    });
    expect(socket.emit).toHaveBeenCalledWith('socketError', {
      event: 'leaveRoom',
      message: 'database unavailable',
    });
  });
});

describe('socket notification handler', () => {
  it('broadcasts the notification to other clients on success', async () => {
    notificationRepository.create.mockResolvedValue({
      id: 1,
      senderId: AUTH_USER,
      receiverId: OTHER_USER,
      content: 'Alice (@alice) followed you',
    });
    const { eventHandlers, broadcastEmit } = setup();

    await eventHandlers['notification'](notificationUser, OTHER_USER, 'follow');

    expect(notificationRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ senderId: AUTH_USER, receiverId: OTHER_USER })
    );
    expect(broadcastEmit).toHaveBeenCalledWith(
      'notification',
      OTHER_USER,
      expect.any(Object)
    );
  });

  it('emits a socketError instead of crashing when the notification insert throws (DB error)', async () => {
    notificationRepository.create.mockRejectedValue(
      new Error('database unavailable')
    );
    const { eventHandlers, socket, broadcastEmit } = setup();

    await eventHandlers['notification'](notificationUser, OTHER_USER, 'follow');

    expect(socket.emit).toHaveBeenCalledWith('socketError', {
      event: 'notification',
      message: 'database unavailable',
    });
    expect(broadcastEmit).not.toHaveBeenCalled();
  });

  it('does not create a notification when the sender argument does not match the socket user', async () => {
    const { eventHandlers, broadcastEmit } = setup();

    await eventHandlers['notification'](
      { id: SPOOFED_USER, name: 'Mallory', username: 'mallory' },
      OTHER_USER,
      'follow'
    );

    expect(notificationRepository.create).not.toHaveBeenCalled();
    expect(broadcastEmit).not.toHaveBeenCalled();
  });
});
