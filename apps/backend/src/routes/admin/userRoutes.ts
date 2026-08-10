import { Router } from 'express';

import multer from 'multer';

import userController from '../../controllers/admin/usersController.ts';
import {
  authMiddleware,
  guestAuthMiddleware,
} from '../../middlewares/authMiddleware.ts';

const upload = multer();

const userRouter = Router();

// check for availability here
userRouter.get('/availability', userController.getAvailability);

userRouter.use(authMiddleware);
userRouter.use(guestAuthMiddleware);

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put(
  '/:id',
  upload.fields([{ name: 'avatar' }, { name: 'cover' }]),
  userController.updateUser
);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
