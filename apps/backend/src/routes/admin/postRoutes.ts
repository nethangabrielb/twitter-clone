import { Router } from 'express';

import postsController from '../../controllers/admin/postsController.ts';
import { upload } from '../../middlewares/upload.ts';

const postRouter = Router();

postRouter.get('/', postsController.getPosts);
postRouter.get('/:postId', postsController.getPost);
postRouter.post('/', upload.single('imageUrl'), postsController.createPost);
postRouter.delete('/:postId', postsController.deletePost);

// user-made replies
postRouter.get('/replies/users/:userId', postsController.getUserReplies);
// user's liked-posts
postRouter.get('/liked/users/:userId', postsController.getUserLiked);

export default postRouter;
