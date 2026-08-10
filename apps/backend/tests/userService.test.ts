import { describe, expect, it, vi } from 'vitest';

import { Prisma } from '../generated/prisma/client.js';

const { createNewUserMock } = vi.hoisted(() => ({
  createNewUserMock: vi.fn(),
}));

vi.mock('../src/repositories/userRepository.ts', () => ({
  default: { createNewUser: createNewUserMock },
}));

import UserService from '../src/services/userService.ts';

const validRegistration = {
  name: 'Test User',
  username: 'testuser',
  email: 'test@example.com',
  password: 'password123',
  onboarded: true,
};

describe('UserService.createNewUser', () => {
  it('returns a clean message instead of leaking the raw Prisma error on a duplicate username/email', async () => {
    createNewUserMock.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError(
        'Unique constraint failed on the fields: (`username`)',
        { code: 'P2002', clientVersion: '6.16.2' }
      )
    );

    await expect(
      UserService.createNewUser(validRegistration)
    ).rejects.toThrow('Username or email already taken');
  });

  it('rethrows non-unique-constraint errors unchanged', async () => {
    const unexpected = new Error('database is down');
    createNewUserMock.mockRejectedValue(unexpected);

    await expect(
      UserService.createNewUser(validRegistration)
    ).rejects.toThrow('database is down');
  });
});
