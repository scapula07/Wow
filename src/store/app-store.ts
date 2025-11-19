import { create } from 'zustand';

interface AppState {
  isCreateStreamOpen: boolean;
  searchQuery: string;
  currentStream: any | null;
  sidebarCollapsed: boolean;
}

interface AppActions {
  setCreateStreamOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCurrentStream: (stream: any | null) => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
}

type AppStore = AppState & AppActions;

export const useAppStore = create<AppStore>()((set) => ({
  // State
  isCreateStreamOpen: false,
  searchQuery: '',
  currentStream: null,
  sidebarCollapsed: false,

  // Actions
  setCreateStreamOpen: (isCreateStreamOpen) => 
    set({ isCreateStreamOpen }),

  setSearchQuery: (searchQuery) => 
    set({ searchQuery }),

  setCurrentStream: (currentStream) => 
    set({ currentStream }),

  setSidebarCollapsed: (sidebarCollapsed) => 
    set({ sidebarCollapsed }),

  toggleSidebar: () => 
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
