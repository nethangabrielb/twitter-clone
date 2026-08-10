import { NextFunction, Request, Response } from 'express';

import { applyFieldAllowlist, sendValidationErrors } from '../handleValidation.ts';
import updateName from '../rules/updateName.ts';
import updateUsername from '../rules/updateUsername.ts';

// Fields that are actually safe to change through PUT /api/users/:id. Anything
// else (email, password, id, isGuest, createdAt, ...) is dropped before it
// reaches the service layer instead of being fed into prisma.user.update.
const ALLOWED_UPDATE_FIELDS = ['name', 'username', 'avatar', 'cover', 'onboarded'];

// `onboarded` arrives as the string "true"/"false" from multipart forms.
// Normalize it to a boolean so the stored value is always a real boolean.
const normalizeOnboarded = (req: Request, _res: Response, next: NextFunction) => {
  if (Object.prototype.hasOwnProperty.call(req.body, 'onboarded')) {
    req.body.onboarded = String(req.body.onboarded) === 'true';
  }
  next();
};

const validateUpdateUser = [
  updateName,
  updateUsername,
  sendValidationErrors,
  applyFieldAllowlist(ALLOWED_UPDATE_FIELDS),
  normalizeOnboarded,
];

export { validateUpdateUser };
