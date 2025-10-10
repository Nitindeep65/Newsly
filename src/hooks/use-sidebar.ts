import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SidebarState {
  isOpen: boolean;
  isHover: boolean;
  settings: {
    disabled: boolean;
  };
  toggleOpen: () => void;
  setIsOpen: (isOpen: boolean) => void;
  setIsHover: (isHover: boolean) => void;
  getOpenState: () => boolean;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set, get) => ({
      isOpen: true,
      isHover: false,
      settings: {
        disabled: false,
      },
      toggleOpen: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },
      setIsOpen: (isOpen: boolean) => {
        set({ isOpen });
      },
      setIsHover: (isHover: boolean) => {
        set({ isHover });
      },
      getOpenState: () => {
        const state = get();
        return state.isOpen || state.isHover;
      },
    }),
    {
      name: "sidebar-state",
    }
  )
);