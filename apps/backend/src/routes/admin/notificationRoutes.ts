import { Router } from 'express';

import notificationController from '../../controllers/admin/notificationController.ts';

const notificationRouter = Router();

notificationRouter.get('/', notificationController.getAll);

export default notificationRouter;
