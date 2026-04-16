import { create } from 'zustand';

interface UiState {
  /** Sidebar открыт/закрыт */
  sidebarOpen: boolean;
  /** Переключить sidebar */
  toggleSidebar: () => void;
  /** Установить состояние sidebar */
  setSidebarOpen: (open: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  sidebarOpen: true,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
