import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';

import type { User } from '../types/user';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const token = cookies.token; // Bearer TOKEN

  if (!token)
    return res
      .status(401)
      .json({ status: 'error', message: 'No token provided' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as User;
    req.user = payload; // attach user info to request
    next();
  } catch {
    res
      .status(403)
      .json({ status: 'error', message: 'Invalid or expired token' });
  }
};
