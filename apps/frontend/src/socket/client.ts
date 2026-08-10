import { io } from "socket.io-client";

export const socket = io(process.env.NEXT_PUBLIC_API as string, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 15000,
  transports: ["websocket"],
  withCredentials: true,
});
