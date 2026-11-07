import { create } from "zustand";

type UIState = {
  mobileSidebarOpen: boolean;
  commandMenuOpen: boolean;
  setMobileSidebarOpen: (open: boolean) => void;
  setCommandMenuOpen: (open: boolean) => void;
};

export const useUIStore = create<UIState>((set) => ({
  mobileSidebarOpen: false,
  commandMenuOpen: false,
  setMobileSidebarOpen: (mobileSidebarOpen) => set({ mobileSidebarOpen }),
  setCommandMenuOpen: (commandMenuOpen) => set({ commandMenuOpen }),
}));
