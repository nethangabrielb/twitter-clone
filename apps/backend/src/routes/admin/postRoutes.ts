import { Router } from 'express';

import postsController from '../../controllers/admin/postsController';
import { authMiddleware } from '../../middlewares/authMiddleware';

const postRouter = Router();

postRouter.use(authMiddleware);

postRouter.get('/', postsController.getPosts);
postRouter.get('/:postId', postsController.getPost);
postRouter.post('/', postsController.createPost);

export default postRouter;
