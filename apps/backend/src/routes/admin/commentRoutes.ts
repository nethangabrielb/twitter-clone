import { Router } from 'express';

import commentsController from '../../controllers/admin/commentsController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const commentRouter = Router();

commentRouter.use(authMiddleware);

commentRouter.post('/', commentsController.createComment);

export default commentRouter;
