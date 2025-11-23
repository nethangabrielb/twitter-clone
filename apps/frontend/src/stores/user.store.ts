import { create } from "zustand";

import type { User } from "@/types/user";

type UserState = {
  user: User | {};
  setUser: (arg0: User) => void;
  removeUser: () => void;
};

const useUser = create<UserState>((set) => ({
  user: {},
  setUser: (user) => set({ user }),
  removeUser: () => set({ user: {} }),
}));

export default useUser;
