import { Request, Response } from 'express';

import UserService from '../../services/userService';
import type { RegistrationBody } from '../../types/auth';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage';

const userController = (() => {
  const getUser = async (req: Request<{ id: string }>, res: Response) => {
    try {
      const user = await UserService.getUserById(Number(req.params.id));
      res.status(200).json({ status: 'success', data: user });
    } catch (err: unknown) {
      res.status(err instanceof Error ? 404 : 500).json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const getAllUsers = async (_req: Request, res: Response) => {
    try {
      const users = await UserService.getAllUsers();
      res.json({ status: 'success', data: users });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const updateUser = async (
    req: Request<{ id: string }, object, Partial<RegistrationBody>>,
    res: Response
  ) => {
    try {
      const updatedUser = await UserService.updateUser(
        Number(req.params.id),
        req.body
      );
      res.json({ status: 'success', data: updatedUser });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const deleteUser = async (req: Request<{ id: string }>, res: Response) => {
    try {
      await UserService.deleteUser(Number(req.params.id));
      res.json({ status: 'success', message: 'User deleted' });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { getUser, getAllUsers, updateUser, deleteUser };
})();

export default userController;
