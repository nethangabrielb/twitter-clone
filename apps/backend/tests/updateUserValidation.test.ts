import { once } from 'node:events';

import express from 'express';

import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

const { findUniqueMock } = vi.hoisted(() => ({
  findUniqueMock: vi.fn(),
}));

vi.mock('../src/prisma/client.ts', () => ({
  prisma: {
    user: {
      findUnique: findUniqueMock,
    },
  },
}));

import { validateUpdateUser } from '../src/validators/user/updateUser.ts';

describe('validateUpdateUser (PUT /api/users/:id)', () => {
  let server: ReturnType<ReturnType<typeof express>['listen']>;
  let baseUrl: string;

  beforeAll(async () => {
    const app = express();
    app.use(express.json());

    // Handler mirrors the real route: validation runs first, then the
    // controller echoes back whatever survived the allowlist.
    app.put('/users/:id', validateUpdateUser, (req, res) => {
      res.json({ status: 'success', body: req.body });
    });

    server = app.listen(0);
    await once(server, 'listening');
    const address = server.address();
    if (address === null || typeof address === 'string') {
      throw new Error('Expected an ephemeral TCP port');
    }
    baseUrl = `http://127.0.0.1:${address.port}`;
  });

  afterAll(async () => {
    if (server) {
      server.close();
    }
  });

  const updateUser = async (body: Record<string, unknown>) => {
    return fetch(`${baseUrl}/users/5`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  };

  it('rejects an empty username instead of silently updating the account', async () => {
    findUniqueMock.mockResolvedValue(null);

    const res = await updateUser({ username: '   ', name: 'Valid Name' });
    const data = await res.json();

    expect(data.status).toBe('error');
    expect(data.message).toBe("Username can't be empty.");
    expect(data.data).toContain("Username can't be empty.");
  });

  it('rejects a username longer than 15 characters', async () => {
    findUniqueMock.mockResolvedValue(null);

    const res = await updateUser({
      username: 'a-username-that-is-way-too-long',
      name: 'Valid Name',
    });
    const data = await res.json();

    expect(data.status).toBe('error');
    expect(data.message).toBe('Username must not exceed 15 characters.');
  });

  it('rejects a username containing whitespace', async () => {
    findUniqueMock.mockResolvedValue(null);

    const res = await updateUser({ username: 'bad username', name: 'Valid Name' });
    const data = await res.json();

    expect(data.status).toBe('error');
    expect(data.message).toBe('Username must not have spaces.');
  });

  it('rejects a username already taken by another account', async () => {
    findUniqueMock.mockResolvedValue({ id: 99, username: 'taken_user' });

    const res = await updateUser({ username: 'taken_user', name: 'Valid Name' });
    const data = await res.json();

    expect(data.status).toBe('error');
    expect(data.message).toBe('Username is already taken.');
  });

  it('allows keeping the current username when updating other fields', async () => {
    findUniqueMock.mockResolvedValue({ id: 5, username: 'my_user' });

    const res = await updateUser({ username: 'my_user', name: 'New Name' });
    const data = await res.json();

    expect(data.status).toBe('success');
    expect(data.body).toEqual({ username: 'my_user', name: 'New Name' });
  });

  it('strips unsafe fields (email, password, id) from the request body', async () => {
    findUniqueMock.mockResolvedValue(null);

    const res = await updateUser({
      username: 'safe_user',
      name: 'Valid Name',
      email: 'attacker@evil.com',
      password: 'HackedPassword1!',
      id: 1,
      isGuest: true,
    });
    const data = await res.json();

    expect(data.status).toBe('success');
    expect(data.body).toEqual({ username: 'safe_user', name: 'Valid Name' });
  });

  it('normalizes onboarded to a boolean', async () => {
    findUniqueMock.mockResolvedValue(null);

    const res = await updateUser({
      username: 'safe_user',
      name: 'Valid Name',
      onboarded: 'true',
    });
    const data = await res.json();

    expect(data.status).toBe('success');
    expect(data.body).toEqual({
      username: 'safe_user',
      name: 'Valid Name',
      onboarded: true,
    });
  });
});
