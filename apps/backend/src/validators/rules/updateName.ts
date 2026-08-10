import { body } from 'express-validator';

export default body('name')
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Name can't be empty.")
  .isLength({ max: 50 })
  .withMessage('Name must not exceed 50 characters.');
