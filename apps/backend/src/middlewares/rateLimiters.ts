import rateLimit from 'express-rate-limit';

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export const loginRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many login attempts. Please try again later.',
});

export const registerRateLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many registration attempts. Please try again later.',
});
