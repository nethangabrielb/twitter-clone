import { Router } from 'express';

import postsController from '../../controllers/admin/postsController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const postRouter = Router();

postRouter.use(authMiddleware);

postRouter.post('/', postsController.createPost);
postRouter.get('/:postId', postsController.getPost);

export default postRouter;
