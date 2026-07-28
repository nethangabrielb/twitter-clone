import { Router } from 'express';

import { postLikesController } from '../../controllers/admin/likesController.ts';

const likesRouter = Router();

likesRouter.post('/posts/:postId', postLikesController.createLike);
likesRouter.delete('/posts/:postId', postLikesController.deleteLike);

export default likesRouter;
