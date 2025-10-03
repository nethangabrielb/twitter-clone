import { Router } from 'express';

import followsController from '../../controllers/admin/followsController';
import userController from '../../controllers/admin/usersController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const followRouter = Router();

followRouter.use(authMiddleware);

followRouter.post('/', followsController.createFollow);
followRouter.delete('/', userController.deleteUser);

export default followRouter;
