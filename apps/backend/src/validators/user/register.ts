import { NextFunction, Request, Response } from 'express';

import { validationResult } from 'express-validator';

import type { RegistrationBody } from '../../types/auth';
import confirmPassword from '../rules/confirmPassword';
import email from '../rules/email';
import name from '../rules/name';
import password from '../rules/password';
import username from '../rules/username';

const registrationRules = [name, username, email, password, confirmPassword];

const validateRegistration = [
  ...registrationRules,
  (
    req: Request<object, object, RegistrationBody>,
    res: Response,
    next: NextFunction
  ) => {
    // Retrieve errors from express-validator on input fields
    const errors = validationResult(req);

    // Return errors if there are any
    if (!errors.isEmpty()) {
      const errorsArr = errors.array({ onlyFirstError: true });
      return res.json({
        status: 'success',
        data: errorsArr.map(err => err.msg),
        message: 'Error validating form input',
      });
    } else {
      delete req.body.confirmPassword;
      next();
    }
  },
];

export { validateRegistration };
