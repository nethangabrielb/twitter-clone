import { ChatMessage } from '@twitter-clone/shared';
import { Server, Socket } from 'socket.io';

import { isSocketValid } from '../middlewares/authMiddleware.ts';
import notificationRepository from '../repositories/notificationRepository.ts';
import messageService from '../services/messageService.ts';
import roomService from '../services/roomService.ts';
import { User } from '../types/user.ts';
import { validateEventSender } from '../utils/validateEventSender.ts';

const handleSocketError = (
  socket: Socket,
  event: string,
  err: unknown,
  callback?: (response: Record<string, unknown>) => void
) => {
  const message = err instanceof Error ? err.message : 'Internal socket error.';
  console.error(`[socket] error in '${event}' handler:`, err);
  socket.emit('socketError', { event, message });
  callback?.({ status: 'error', message });
};

export const initSocket = (io: Server) => {
  io.use(isSocketValid);

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

          if (!message || message.roomId == null) {
            throw new Error('There was an error sending the message.');
          }

          callback({ success: true, message });

          socket.to(String(message.roomId)).emit('newMessage', message);

          socket.broadcast.emit('newMessageNotification', message.receiverId);
        } catch (err: unknown) {
          console.error(`[socket] error in 'newMessage' handler:`, err);
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
        if (!validateEventSender(senderId, socket.data.userId)) {
          console.log('Invalid socket event.');
          return;
        }

        try {
          // getRoomForUser returns the room only if the sender is a member.
          const room = await roomService.getRoomForUser(
            senderId,
            Number(roomId)
          );
          if (room) {
            socket.join(roomId);
            callback({ status: 'ok' });
          } else {
            console.log('User is not a part of the room.');
          }
        } catch (err: unknown) {
          handleSocketError(socket, 'joinRoom', err, callback);
        }
      }
    );

    socket.on(
      'leaveRoom',
      async (roomId: string, senderId: number, callback) => {
        if (!validateEventSender(senderId, socket.data.userId)) {
          console.log('Invalid socket event.');
          return;
        }

        try {
          const room = await roomService.getRoomForUser(
            senderId,
            Number(roomId)
          );
          if (room) {
            socket.leave(roomId);
            callback({ status: 'ok' });
          } else {
            console.log('User is not a part of the room.');
          }
        } catch (err: unknown) {
          handleSocketError(socket, 'leaveRoom', err, callback);
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
        if (!validateEventSender(user?.id, socket.data.userId)) {
          console.log('Invalid socket event.');
          return;
        }

        try {
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
        } catch (err: unknown) {
          handleSocketError(socket, 'notification', err);
        }
      }
    );
  });
};
