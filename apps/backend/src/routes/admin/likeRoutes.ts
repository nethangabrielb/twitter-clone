import { Router } from 'express';

import {
  commentLikesController,
  postLikesController,
} from '../../controllers/admin/likesController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const likesRouter = Router();

likesRouter.use(authMiddleware);

likesRouter.post('/posts/:postId', postLikesController.createLike);
likesRouter.delete('/posts/:postId', postLikesController.deleteLike);

likesRouter.post('/comments/:commentId', commentLikesController.createLike);
likesRouter.delete('/comments/:commentId', commentLikesController.deleteLike);

export default likesRouter;
