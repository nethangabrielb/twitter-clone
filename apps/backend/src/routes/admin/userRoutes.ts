import { Router } from 'express';

import userController from '../../controllers/admin/usersController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const userRouter = Router();

userRouter.use(authMiddleware);

userRouter.get('/', userController.getAllUsers);
userRouter.get('/:id', userController.getUser);
userRouter.put('/:id', userController.updateUser);
userRouter.delete('/:id', userController.deleteUser);

export default userRouter;
