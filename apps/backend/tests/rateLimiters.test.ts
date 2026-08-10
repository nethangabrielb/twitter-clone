import { describe, expect, it, vi } from 'vitest';

import {
  loginRateLimiter,
  registerRateLimiter,
} from '../src/middlewares/rateLimiters.ts';

type Res = {
  status: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
  setHeader: ReturnType<typeof vi.fn>;
};

const createReq = (ip: string) => ({
  ip,
  headers: {},
  app: { get: () => 1 },
});

const createRes = (): Res => {
  const res = {} as Res;
  res.status = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn().mockReturnValue(res);
  return res;
};

const callTimes = async (
  limiter: (req: unknown, res: unknown, next: unknown) => unknown,
  ip: string,
  times: number
) => {
  const nexts: ReturnType<typeof vi.fn>[] = [];
  let res: Res = createRes();
  for (let i = 0; i < times; i++) {
    res = createRes();
    const next = vi.fn();
    nexts.push(next);
    await limiter(createReq(ip), res, next);
  }
  return { res, next: nexts[nexts.length - 1], nexts };
};

describe('rate limiters', () => {
  it('blocks a client after 10 failed login attempts', async () => {
    const allowed = await callTimes(loginRateLimiter, '10.0.0.1', 10);
    expect(
      allowed.nexts.every(n => n.mock.calls.length === 1)
    ).toBe(true);

    const blocked = await callTimes(loginRateLimiter, '10.0.0.1', 1);
    expect(blocked.nexts[0]).not.toHaveBeenCalled();
    expect(blocked.res.status).toHaveBeenCalledWith(429);
    expect(blocked.res.send).toHaveBeenCalledWith(
      'Too many login attempts. Please try again later.'
    );
  });

  it('allows more register attempts than login before blocking', async () => {
    const allowed = await callTimes(registerRateLimiter, '10.0.0.2', 11);
    expect(
      allowed.nexts.every(n => n.mock.calls.length === 1)
    ).toBe(true);

    const blocked = await callTimes(registerRateLimiter, '10.0.0.2', 20);
    expect(blocked.nexts[blocked.nexts.length - 1]).not.toHaveBeenCalled();
    expect(blocked.res.status).toHaveBeenCalledWith(429);
  });

  it('uses distinct counters per IP', async () => {
    await callTimes(loginRateLimiter, '10.0.0.3', 10);

    const { res, nexts } = await callTimes(loginRateLimiter, '10.0.0.4', 1);
    expect(nexts[0]).toHaveBeenCalledTimes(1);
    expect(res.status).not.toHaveBeenCalledWith(429);
  });
});
