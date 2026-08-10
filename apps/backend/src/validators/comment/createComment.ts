import { body } from 'express-validator';

import { applyFieldAllowlist, sendValidationErrors } from '../handleValidation.ts';
import content from '../rules/content.ts';

const replyIdRule = body('replyId')
  .exists()
  .withMessage('replyId is required.')
  .custom(value => {
    return Number.isInteger(Number(value)) && Number(value) > 0;
  })
  .withMessage('replyId must be a positive integer.');

const validateCreateComment = [
  content,
  replyIdRule,
  sendValidationErrors,
  // userId is derived from the session and imageUrl is a multer file upload.
  applyFieldAllowlist(['content', 'replyId']),
];

export { validateCreateComment };
