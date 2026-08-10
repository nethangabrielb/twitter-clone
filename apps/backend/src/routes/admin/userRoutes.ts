import { Router } from 'express';

import userController from '../../controllers/admin/usersController.ts';
import {
  authMiddleware,
  guestAuthMiddleware,
} from '../../middlewares/authMiddleware.ts';
import { upload } from '../../middlewares/upload.ts';
import { validateUpdateUser } from '../../validators/user/updateUser.ts';

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
  validateUpdateUser,
  userController.updateUser
);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
