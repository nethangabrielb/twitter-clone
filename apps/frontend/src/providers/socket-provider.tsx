"use client";

import { socket } from "@/socket/client";
import useUser from "@/stores/user.store";
import _ from "lodash";

import { ReactNode, useEffect, useRef } from "react";

import { User } from "@/types/user";

const MAX_RECONNECT_DELAY = 15000;

const SocketProvider = ({ children }: { children: ReactNode }) => {
  const user = useUser((state) => state.user) as User;
  const prevUser = useRef(user);

  useEffect(() => {
    if (user?.id !== prevUser?.current?.id) {
      if (!_.isEmpty(user) && socket.disconnected) {
        socket.connect();
      }
    }

    return () => {
      if (socket.connected && user?.id === prevUser?.current?.id) {
        socket.disconnect();
      }
      prevUser.current = user;
    };
  }, [user?.id]);

  useEffect(() => {
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let retryCount = 0;

    const attemptReconnect = () => {
      if (!socket.disconnected) return;

      retryCount += 1;
      const delay = Math.min(1000 * 2 ** retryCount, MAX_RECONNECT_DELAY);

      if (retryTimer) clearTimeout(retryTimer);
      retryTimer = setTimeout(() => {
        if (socket.disconnected) socket.connect();
      }, delay);
    };

    const handleConnectError = () => attemptReconnect();

    const handleConnect = () => {
      retryCount = 0;
    };

    const handleOnline = () => {
      if (socket.disconnected) {
        retryCount = 0;
        socket.connect();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible" && socket.disconnected) {
        retryCount = 0;
        socket.connect();
      }
    };

    socket.on("connect_error", handleConnectError);
    socket.on("connect", handleConnect);
    window.addEventListener("online", handleOnline);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (retryTimer) clearTimeout(retryTimer);
      socket.off("connect_error", handleConnectError);
      socket.off("connect", handleConnect);
      window.removeEventListener("online", handleOnline);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return <>{children}</>;
};

export default SocketProvider;
