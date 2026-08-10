import { Router } from 'express';

import commentsController from '../../controllers/admin/commentsController.ts';
import { upload } from '../../middlewares/upload.ts';

const commentRouter = Router();

commentRouter.get('/:commentId', commentsController.getComment);
commentRouter.post(
  '/',
  upload.single('imageUrl'),
  commentsController.createComment
);
commentRouter.delete('/:commentId', commentsController.deleteComment);

export default commentRouter;
