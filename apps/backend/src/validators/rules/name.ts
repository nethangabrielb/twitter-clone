import { body } from 'express-validator';

export default body('name')
  .exists()
  .withMessage('A name is required.')
  .trim()
  .notEmpty()
  .withMessage("Name can't be empty.");
