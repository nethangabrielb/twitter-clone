import { Router } from 'express';

import likesController from '../../controllers/admin/likesController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const likesRouter = Router();

likesRouter.use(authMiddleware);

likesRouter.post('/', likesController.createLike);

export default likesRouter;
