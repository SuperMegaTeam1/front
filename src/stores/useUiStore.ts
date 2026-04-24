import { create } from 'zustand';

interface UiState {
  /** Sidebar открыт/закрыт */
  isSidebarOpen: boolean;
  /** Переключить sidebar */
  toggleSidebar: () => void;
  /** Установить состояние sidebar */
  setSidebarOpen: (isOpen: boolean) => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isSidebarOpen: true,

  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));
