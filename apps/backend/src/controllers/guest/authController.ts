import { Request, Response } from 'express';

import UserService from '../../services/userService';
import type { LoginBody, RegistrationBody } from '../../types/auth';

const GENERIC_ERROR_MESSAGE = 'An unknown error occurred';

const authController = (() => {
  const register = async (
    req: Request<object, object, RegistrationBody>,
    res: Response
  ) => {
    try {
      const newUser = await UserService.createNewUser(req.body);

      res.status(200).json({
        status: 'success',
        message: 'User created successfully!',
        data: newUser,
      });
    } catch (err: unknown) {
      res.status(500).json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const login = async (
    req: Request<object, object, LoginBody>,
    res: Response
  ) => {
    try {
      const token = await UserService.loginUser(req.body);

      res.status(200).json({
        status: 'success',
        message: 'Log in success!',
        data: token,
      });
    } catch (err: unknown) {
      res.status(err instanceof Error ? 400 : 500).json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const redirect = (req: Request, res: Response) => {};

  return { register, login, redirect };
})();

export default authController;
