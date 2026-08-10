import { NextFunction, Request, Response } from 'express';

import multer from 'multer';

import { GENERIC_ERROR_MESSAGE } from '../utils/errorMessage.ts';

// Catch errors thrown by middleware (e.g. multer's file size / file type
// rejections) before they hit Express's default HTML error handler, which
// would not be a clean JSON error. Controllers handle their own errors.
export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  // `_next` is intentionally unused; Express only routes errors to
  // 4-arity middleware, so the parameter must stay in the signature.
  void _next;

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        status: 'error',
        message: 'File is too large. Maximum allowed size is 5MB.',
      });
    }

    return res.status(400).json({ status: 'error', message: err.message });
  }

  return res
    .status(500)
    .json({ status: 'error', message: GENERIC_ERROR_MESSAGE });
};
