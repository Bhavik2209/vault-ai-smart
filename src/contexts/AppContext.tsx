import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: Date;
  path?: string;
  thumbnail?: string;
}

export interface SearchResult extends FileItem {
  snippet?: string;
  relevanceScore?: number;
}

interface AppState {
  files: FileItem[];
  searchResults: SearchResult[];
  isSearching: boolean;
  selectedFiles: string[];
  sidebarCollapsed: boolean;
  currentPage: 'home' | 'search' | 'settings';
  storageUsed: number;
  storageLimit: number;
  settings: {
    storageLocation: string;
    darkMode: boolean;
  };
}

type AppAction =
  | { type: 'ADD_FILES'; payload: FileItem[] }
  | { type: 'REMOVE_FILE'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: SearchResult[] }
  | { type: 'SET_SEARCHING'; payload: boolean }
  | { type: 'TOGGLE_FILE_SELECTION'; payload: string }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_PAGE'; payload: 'home' | 'search' | 'settings' }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<AppState['settings']> }
  | { type: 'UPDATE_STORAGE'; payload: { used: number; limit: number } };

const initialState: AppState = {
  files: [],
  searchResults: [],
  isSearching: false,
  selectedFiles: [],
  sidebarCollapsed: false,
  currentPage: 'home',
  storageUsed: 0,
  storageLimit: 100 * 1024 * 1024 * 1024, // 100GB
  settings: {
    storageLocation: '~/Documents/AI-File-Vault',
    darkMode: false,
  },
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'ADD_FILES':
      const newFiles = action.payload.filter(
        file => !state.files.some(existing => existing.id === file.id)
      );
      return {
        ...state,
        files: [...state.files, ...newFiles],
        storageUsed: state.storageUsed + newFiles.reduce((acc, file) => acc + file.size, 0),
      };

    case 'REMOVE_FILE':
      const fileToRemove = state.files.find(f => f.id === action.payload);
      return {
        ...state,
        files: state.files.filter(f => f.id !== action.payload),
        selectedFiles: state.selectedFiles.filter(id => id !== action.payload),
        storageUsed: state.storageUsed - (fileToRemove?.size || 0),
      };

    case 'SET_SEARCH_RESULTS':
      return { ...state, searchResults: action.payload, isSearching: false };

    case 'SET_SEARCHING':
      return { ...state, isSearching: action.payload };

    case 'TOGGLE_FILE_SELECTION':
      const isSelected = state.selectedFiles.includes(action.payload);
      return {
        ...state,
        selectedFiles: isSelected
          ? state.selectedFiles.filter(id => id !== action.payload)
          : [...state.selectedFiles, action.payload],
      };

    case 'CLEAR_SELECTION':
      return { ...state, selectedFiles: [] };

    case 'TOGGLE_SIDEBAR':
      return { ...state, sidebarCollapsed: !state.sidebarCollapsed };

    case 'SET_PAGE':
      return { ...state, currentPage: action.payload };

    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: { ...state.settings, ...action.payload },
      };

    case 'UPDATE_STORAGE':
      return {
        ...state,
        storageUsed: action.payload.used,
        storageLimit: action.payload.limit,
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};