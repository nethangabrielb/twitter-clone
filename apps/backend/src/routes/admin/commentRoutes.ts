import { Router } from 'express';

import commentsController from '../../controllers/admin/commentsController.ts';
import { upload } from '../../middlewares/upload.ts';
import { validateCreateComment } from '../../validators/comment/createComment.ts';

const commentRouter = Router();

commentRouter.get('/:commentId', commentsController.getComment);
commentRouter.post(
  '/',
  upload.single('imageUrl'),
  validateCreateComment,
  commentsController.createComment
);
commentRouter.delete('/:commentId', commentsController.deleteComment);

export default commentRouter;
