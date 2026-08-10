import { Room } from '@twitter-clone/shared';

import roomRepository from '../repositories/roomRepository.ts';

const roomService = {
  createRoom: async (room: Room) => {
    const users = room.users;

    const usersHasRooms = await roomRepository.findByUsers(users);

    if (usersHasRooms) {
      throw new Error('Room already exists');
    } else {
      const roomReturned = await roomRepository.create(room);
      if (!roomReturned) {
        throw new Error('Error fetching the database');
      }
      return roomReturned;
    }
  },
  getUserRooms: async (userId: number) => {
    const rooms = await roomRepository.findByUserId(userId);
    if (!rooms) {
      throw new Error('Error fetching the database');
    }
    return rooms;
  },
  // Shared membership helper: returns the room (with its users) only if the
  // given user is a member, otherwise null. Used by the messages REST
  // controller and the socket newMessage/joinRoom/leaveRoom handlers.
  getRoomForUser: async (userId: number, roomId: number) => {
    return roomRepository.findByIdForUser(roomId, userId);
  },
};

export default roomService;
