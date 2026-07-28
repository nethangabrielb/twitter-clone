import { Router } from 'express';

import bookmarkController from '../../controllers/admin/bookmarkController.ts';

const bookmarkRouter = Router();

bookmarkRouter.post('/', bookmarkController.createBookmark);
bookmarkRouter.delete('/:bookmarkId', bookmarkController.deleteBookmark);

export default bookmarkRouter;
