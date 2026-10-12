import { create } from "zustand";

type AuthStore = {
  isAuthModalOpen: boolean;
  toggleAuthModal: () => void;
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  isAuthModalOpen: false,

  toggleAuthModal: () =>
    set((state) => ({ isAuthModalOpen: !state.isAuthModalOpen })),
}));
