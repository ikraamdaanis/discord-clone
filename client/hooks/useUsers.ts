import { create } from "zustand";

type ModalStore = {
  users: string[];
  setUsers: (users: string[]) => void;
};

export const useUsers = create<ModalStore>(set => ({
  users: [],
  setUsers: (users: string[]) => {
    set({ users });
  }
}));
