import { NextFunction, Request, Response } from 'express';

import { body } from 'express-validator';

import { sendValidationErrors } from '../handleValidation.ts';

const usersRule = body('users')
  .exists()
  .withMessage('Users are required.')
  .isArray({ min: 2 })
  .withMessage('A room must have at least two users.');

const userIdRule = body('users.*.id')
  .exists()
  .withMessage('Each room member must have an id.')
  .custom(value => {
    return Number.isInteger(Number(value)) && Number(value) > 0;
  })
  .withMessage('Room member ids must be positive integers.');

// Only the member ids are meaningful to the repository — drop the rest of the
// payload (names, avatars, passwords, ...) that the client may have attached.
const sanitizeRoomBody = (req: Request, _res: Response, next: NextFunction) => {
  const users: Array<{ id?: number | string }> = Array.isArray(
    req.body?.users
  )
    ? req.body.users
    : [];
  req.body = {
    users: users.map(user => ({ id: Number(user?.id) })),
  };
  next();
};

const validateCreateRoom = [usersRule, userIdRule, sendValidationErrors, sanitizeRoomBody];

export { validateCreateRoom };
