import { create } from "zustand";
import { AuthStore } from "./types";

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  combinedRole: null,
  setUser: (user) => set({ user }),
  setCombinedRole: (combinedRole) => set({ combinedRole }),
}));
