import { Router } from 'express';

import roomController from '../../controllers/admin/roomController.ts';
import { validateCreateRoom } from '../../validators/room/createRoom.ts';

const roomRouter = Router();

roomRouter.post('/', validateCreateRoom, roomController.createRoom);
roomRouter.get('/users/:userId', roomController.getUserRooms);

export default roomRouter;
