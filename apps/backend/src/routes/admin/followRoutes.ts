import { Router } from 'express';

import followsController from '../../controllers/admin/followsController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const followRouter = Router();

followRouter.use(authMiddleware);

followRouter.get('/:userId', followsController.getFollows);
followRouter.post('/', followsController.createFollow);
followRouter.delete('/:followId', followsController.deleteFollow);

export default followRouter;
