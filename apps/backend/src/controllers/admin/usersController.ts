import { Request, Response } from 'express';

import { decode } from 'base64-arraybuffer';

import UserService from '../../services/userService';
import { client } from '../../supabase/client';
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
      if (_req.query.current) {
        res.json({ status: 'success', data: _req.user });
      } else {
        const users = await UserService.getAllUsers();
        res.json({ status: 'success', data: users });
      }
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
    console.log(req.user);
    console.log(req.params.id);
    try {
      // check if there is file
      if (req.file) {
        // decode buffer to base64 string
        const base64 = req.file.buffer.toString('base64');

        // upload file
        const { data, error } = await client.storage
          .from('images')
          .upload(
            `${req.body.username}-avatar-${Date.now().toString()}`,
            decode(base64),
            {
              cacheControl: '3600',
              contentType: req.file.mimetype,
              upsert: false,
            }
          );

        if (error) {
          throw new Error('There was an error processing the form.');
        }

        // get the file public link
        const { data: image } = client.storage
          .from('images')
          .getPublicUrl(data.path);

        req.body = { ...req.body, avatar: image.publicUrl };
      }

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
