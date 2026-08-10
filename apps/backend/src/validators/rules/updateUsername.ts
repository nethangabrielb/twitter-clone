import { body } from 'express-validator';

import { prisma } from '../../prisma/client.ts';

export default body('username')
  .optional()
  .trim()
  .notEmpty()
  .withMessage("Username can't be empty.")
  .isLength({ max: 15 })
  .withMessage('Username must not exceed 15 characters.')
  .custom(value => {
    return !/\s/.test(value);
  })
  .withMessage('Username must not have spaces.')
  .custom(async (value, { req }) => {
    const user = await prisma.user.findUnique({
      where: {
        username: value,
      },
    });
    // Uniqueness is enforced while ignoring the account being updated.
    if (user && user.id !== Number(req.params?.id)) {
      throw new Error('Username is already taken.');
    }
  });
