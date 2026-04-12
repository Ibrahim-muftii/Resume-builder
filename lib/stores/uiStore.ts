import { create } from 'zustand';

type MobilePanel = 'sections' | 'canvas' | 'editor' | 'design';

type UiStoreState = {
  isTemplateSelectorOpen: boolean;
  isAddSectionModalOpen: boolean;
  isMobilePanel: MobilePanel;
  isDarkMode: boolean;
  sidebarWidth: number;
  setIsTemplateSelectorOpen: (isOpen: boolean) => void;
  setIsAddSectionModalOpen: (isOpen: boolean) => void;
  setIsMobilePanel: (panel: MobilePanel) => void;
  setIsDarkMode: (isDarkMode: boolean) => void;
  setSidebarWidth: (width: number) => void;
};

export const useUiStore = create<UiStoreState>((set) => ({
  isTemplateSelectorOpen: false,
  isAddSectionModalOpen: false,
  isMobilePanel: 'sections',
  isDarkMode: false,
  sidebarWidth: 40,
  setIsTemplateSelectorOpen: (isOpen) => set({ isTemplateSelectorOpen: isOpen }),
  setIsAddSectionModalOpen: (isOpen) => set({ isAddSectionModalOpen: isOpen }),
  setIsMobilePanel: (panel) => set({ isMobilePanel: panel }),
  setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
  setSidebarWidth: (width) => set({ sidebarWidth: width }),
}));
