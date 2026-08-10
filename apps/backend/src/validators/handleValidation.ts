import { NextFunction, Request, Response } from 'express';

import { validationResult } from 'express-validator';

// Shared final step for every validator middleware chain. Mirrors the error
// shape used across the backend ({ status, message, data }) so clients can
// render a clear message without depending on HTTP status codes.
export const sendValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors.array({ onlyFirstError: true }).map(
      err => err.msg
    );

    return res.json({
      status: 'error',
      message: messages[0] ?? 'Invalid input.',
      data: messages,
    });
  }

  next();
};

// Strips every field not in `fields` from req.body so untrusted payload
// fields never reach the service/repository layer (e.g. password, email,
// ids, or arbitrary metadata being written straight into prisma).
export const applyFieldAllowlist = (fields: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const body = req.body ?? {};
    const sanitized: Record<string, unknown> = {};

    for (const field of fields) {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        sanitized[field] = body[field];
      }
    }

    req.body = sanitized;
    next();
  };
};
