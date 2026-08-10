import { Request, Response } from 'express';

import messageService from '../../services/messageService.ts';
import roomService from '../../services/roomService.ts';
import { User } from '../../types/user.ts';
import { GENERIC_ERROR_MESSAGE } from '../../utils/errorMessage.ts';

const messageController = (() => {
  const getMessages = async (
    req: Request<{ roomId: number }, object, object>,
    res: Response
  ) => {
    try {
      const user = req.user as User;

      if (user.isGuest) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Unauthorized access.',
        });
      }

      const roomId = Number(req.params.roomId);
      const room = await roomService.getRoomForUser(user.id, roomId);

      if (!room) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Unauthorized access.',
        });
      }

      const messages = await messageService.getByRoomId(roomId);

      res.json({
        status: 'success',
        data: messages,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  const patchMessages = async (
    req: Request<{ roomId: number }, object, object>,
    res: Response
  ) => {
    try {
      const user = req.user as User;
      const roomId = Number(req.params.roomId);
      const room = await roomService.getRoomForUser(user.id, roomId);

      if (!room) {
        return res.status(403).json({
          error: 'Forbidden',
          message: 'Unauthorized access.',
        });
      }

      const messages = await messageService.patchMessagesUnreadStatus(roomId);

      res.json({
        status: 'success',
        data: messages,
      });
    } catch (err: unknown) {
      res.json({
        status: 'error',
        message: err instanceof Error ? err.message : GENERIC_ERROR_MESSAGE,
      });
    }
  };

  return { getMessages, patchMessages };
})();

export default messageController;
