import { body } from 'express-validator';

export default body('content')
  .exists()
  .withMessage('Content is required.')
  .trim()
  .notEmpty()
  .withMessage("Content can't be empty.")
  .isLength({ max: 280 })
  .withMessage('Content must not exceed 280 characters.');
