import { describe, expect, it, vi } from 'vitest';

import { guestAuthMiddleware } from '../src/middlewares/authMiddleware.ts';
import { createReq, createRes } from './helpers.ts';

describe('guestAuthMiddleware', () => {
  const guestUser = { id: 999999999, isGuest: true };
  const realUser = { id: 5 };

  it('blocks guests from write methods', async () => {
    const next = vi.fn();
    const req = createReq({
      method: 'POST',
      path: '/api/posts',
      user: guestUser,
    });
    const res = createRes();

    guestAuthMiddleware(req as never, res as never, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('allows guests to use read methods', async () => {
    const next = vi.fn();
    const req = createReq({
      method: 'GET',
      path: '/api/users?current=true',
      user: guestUser,
    });
    const res = createRes();

    guestAuthMiddleware(req as never, res as never, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalled();
  });

  it('does not block authenticated (non-guest) writes', async () => {
    const next = vi.fn();
    const req = createReq({
      method: 'POST',
      path: '/api/posts',
      user: realUser,
    });
    const res = createRes();

    guestAuthMiddleware(req as never, res as never, next);

    expect(next).toHaveBeenCalledTimes(1);
  });
});
