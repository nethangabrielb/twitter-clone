import { body } from 'express-validator';

export default body('password')
  .exists()
  .withMessage('Password is required.')
  .trim()
  .notEmpty()
  .withMessage("Confirm password can't be empty.")
  .isLength({ min: 8 })
  .withMessage('Confirm password must have a minimum of 8 characters.')
  .custom(value => {
    return /[!@#$%^&*(),.?":{}|<>]/.test(value);
  })
  .withMessage('Confirm password must contain at least 1 special character.')
  .custom(value => {
    return /[A-Z]/.test(value);
  })
  .withMessage(
    'Confirm password must contain at least 1 upper case character.'
  );
