import { describe, expect, it, vi } from 'vitest';

import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';

import { isSocketValid } from '../src/middlewares/authMiddleware.ts';

const makeSocket = (token?: string) => {
  const socket = {
    handshake: {
      headers: { cookie: token ? `token=${token}` : '' },
    },
    data: {},
  };
  return { socket: socket as unknown as Socket, data: socket.data };
};

const signToken = (overrides: Record<string, unknown> = {}) =>
  jwt.sign({ id: 7, isGuest: false, ...overrides }, 'test-secret', {
    expiresIn: '1h',
  });

describe('isSocketValid', () => {
  it('accepts a valid token and sets socket.data.userId', () => {
    const { socket, data } = makeSocket(signToken());
    const next = vi.fn();

    isSocketValid(socket, next);

    expect(next).toHaveBeenCalledWith();
    expect(data).toEqual({ userId: 7 });
  });

  it('calls next(new Error("invalid token")) for an expired token instead of throwing', () => {
    const expired = jwt.sign({ id: 7 }, 'test-secret', { expiresIn: '-1h' });
    const { socket } = makeSocket(expired);
    const next = vi.fn();

    expect(() => isSocketValid(socket, next)).not.toThrow();
    expect(next).toHaveBeenCalledWith(new Error('invalid token'));
  });

  it('calls next(new Error("invalid token")) for a malformed token instead of throwing', () => {
    const { socket } = makeSocket('not-a-real-token');
    const next = vi.fn();

    expect(() => isSocketValid(socket, next)).not.toThrow();
    expect(next).toHaveBeenCalledWith(new Error('invalid token'));
  });

  it('calls next(new Error("invalid token")) when no token cookie is present', () => {
    const { socket } = makeSocket();
    const next = vi.fn();

    isSocketValid(socket, next);

    expect(next).toHaveBeenCalledWith(new Error('invalid token'));
  });

  it('calls next(new Error("invalid token")) for a token signed with the wrong secret', () => {
    const wrongSecret = jwt.sign({ id: 7 }, 'wrong-secret');
    const { socket } = makeSocket(wrongSecret);
    const next = vi.fn();

    expect(() => isSocketValid(socket, next)).not.toThrow();
    expect(next).toHaveBeenCalledWith(new Error('invalid token'));
  });
});
