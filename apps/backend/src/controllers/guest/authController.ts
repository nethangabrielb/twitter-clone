import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import path, { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import UserService from '../../services/userService';
import type { LoginBody, RegistrationBody } from '../../types/auth';

const GENERIC_ERROR_MESSAGE = 'An unknown error occurred';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ROOT_DIR = join(__dirname, '../../../');

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

      res.clearCookie('token', { httpOnly: true });
      res.cookie('token', token, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 14,
      });
      res.status(200).json({
        status: 'success',
        message: 'Log in success!',
      });
    } catch (err: unknown) {
      res.status(err instanceof Error ? 400 : 500).json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const logout = async (req: Request, res: Response) => {
    try {
      res.clearCookie('token', { httpOnly: true });
      res.status(200).json({
        status: 'success',
        message: 'Log out success!',
      });
    } catch (err: unknown) {
      res.status(err instanceof Error ? 400 : 500).json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const redirect = (req: Request, res: Response) => {
    // create a token for the user
    if (req.user) {
      const token = jwt.sign(req.user, process.env.JWT_SECRET!);

      res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Secure; Path=/`);
      res.sendFile(path.join(ROOT_DIR, 'public', 'redirect.html'));
    }
  };

  return { register, login, logout, redirect };
})();

export default authController;
