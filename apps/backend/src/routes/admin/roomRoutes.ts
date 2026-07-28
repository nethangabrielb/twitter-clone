import { Router } from 'express';

import roomController from '../../controllers/admin/roomController.ts';

const roomRouter = Router();

roomRouter.post('/', roomController.createRoom);
roomRouter.get('/users/:userId', roomController.getUserRooms);

export default roomRouter;
