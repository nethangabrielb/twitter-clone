import { ChatMessage } from '@twitter-clone/shared';
import { Server, Socket } from 'socket.io';

import { isSocketValid } from '../middlewares/authMiddleware.ts';
import notificationRepository from '../repositories/notificationRepository.ts';
import messageService from '../services/messageService.ts';
import roomService from '../services/roomService.ts';
import { User } from '../types/user.ts';
import { validateEventSender } from '../utils/validateEventSender.ts';

export const initSocket = (io: Server) => {
  io.use((socket, next) => {
    if (isSocketValid(socket)) {
      next();
    } else {
      next(new Error('Invalid connection attempt.'));
    }
  });

  io.on('connection', (socket: Socket) => {
    socket.on(
      'newMessage',
      async (data: ChatMessage, senderId: number, callback) => {
        if (!validateEventSender(senderId, socket.data.userId)) {
          console.log('Invalid socket event.');
          return;
        }

        try {
          // senderId is derived from the authenticated socket user (and the
          // receiver is validated against the room's members) inside
          // messageService.sendMessage — the client payload is never trusted.
          const message = await messageService.sendMessage(
            socket.data.userId,
            data
          );

          callback({ success: true, message });

          socket.to(String(message.roomId)).emit('newMessage', message);

          socket.broadcast.emit('newMessageNotification', message.receiverId);
        } catch (err: unknown) {
          callback({
            success: false,
            message:
              err instanceof Error
                ? err.message
                : 'There was an error sending the message.',
          });
        }
      }
    );
    socket.on(
      'joinRoom',
      async (roomId: string, senderId: number, callback) => {
        if (validateEventSender(senderId, socket.data.userId)) {
          // getRoomForUser returns the room only if the sender is a member.
          const room = await roomService.getRoomForUser(senderId, Number(roomId));
          if (room) {
            socket.join(roomId);
            callback({ status: 'ok' });
          } else {
            console.log('User is not a part of the room.');
          }
        }
      }
    );

    socket.on(
      'leaveRoom',
      async (roomId: string, senderId: number, callback) => {
        if (validateEventSender(senderId, socket.data.userId)) {
          const room = await roomService.getRoomForUser(senderId, Number(roomId));
          if (room) {
            socket.leave(roomId);
            callback({ status: 'ok' });
          } else {
            console.log('User is not a part of the room.');
          }
        }
      }
    );

    socket.on(
      'notification',
      async (
        user: User,
        receiverId: number,
        type: 'reply' | 'like' | 'follow',
        postId?: number,
        postContent?: string
      ) => {
        if (validateEventSender(user?.id, socket.data.userId)) {
          let content: string = '';
          if (type === 'reply') {
            content = `${user.name} (@${user.username}) replied to your post`;
          } else if (type === 'like') {
            content = `${user.name} (@${user.username}) liked your post`;
          } else if (type === 'follow') {
            content = `${user.name} (@${user.username}) followed you`;
          }

          const notification = await notificationRepository.create({
            senderId: user?.id,
            receiverId: receiverId,
            content,
            postId: postId ?? undefined,
            replyContent: postContent ?? undefined,
          });

          if (notification) {
            socket.broadcast.emit('notification', receiverId, notification);
          }
        }
      }
    );
  });
};
