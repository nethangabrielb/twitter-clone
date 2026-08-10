import { ChatMessage } from '@twitter-clone/shared';

import messageRepository from '../repositories/messageRepository.ts';
import roomService from './roomService.ts';

const messageService = {
  createMessage: (message: ChatMessage) => messageRepository.create(message),
  sendMessage: async (senderId: number, data: ChatMessage) => {
    const content = typeof data?.content === 'string' ? data.content.trim() : '';
    if (!content) {
      throw new Error('Message cannot be empty.');
    }
    if (content.length > 1000) {
      throw new Error('Message cannot exceed 1000 characters.');
    }

    const roomId = Number(data.roomId);
    if (Number.isNaN(roomId)) {
      throw new Error('Invalid room.');
    }

    const room = await roomService.getRoomForUser(senderId, roomId);
    if (!room) {
      throw new Error('You are not a member of this room.');
    }

    // Derive the sender from the authenticated user and validate the
    // receiver against the room's members — never trust the client payload.
    const otherMembers = room.users.filter(user => user.id !== senderId);
    const receiverId = room.users.some(
      user => user.id === data.receiverId && user.id !== senderId
    )
      ? data.receiverId
      : otherMembers[0]?.id;

    if (!receiverId) {
      throw new Error('Invalid room.');
    }

    const message = await messageRepository.create({
      ...data,
      content,
      senderId,
      receiverId,
      roomId: room.id,
    });

    if (!message) {
      throw new Error('There was an error sending the message.');
    }

    return message;
  },
  getByRoomId: async (roomId: number) => {
    const messages = await messageRepository.findByRoomId(roomId);
    if (!messages) {
      throw new Error('Error occured fetching messages');
    }
    return messages;
  },
  patchMessagesUnreadStatus: async (roomId: number) => {
    const messages = await messageRepository.updateByRoomId(roomId);
    if (!messages) {
      throw new Error('Error occured fetching messages');
    }
    return messages;
  },
};

export default messageService;
