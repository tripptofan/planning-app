// src/store/slices/uiSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

interface UiState {
  sidebarOpen: boolean
  currentModule: 'review-items' | 'participants' | 'timer' | 'vote-cards'
  showConfigModal: boolean
  showVoteResults: boolean
  darkMode: boolean
  loading: boolean
  error: string | null
}

const initialState: UiState = {
  sidebarOpen: true,
  currentModule: 'review-items',
  showConfigModal: false,
  showVoteResults: false,
  darkMode: false,
  loading: false,
  error: null
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    
    setCurrentModule: (state, action: PayloadAction<UiState['currentModule']>) => {
      state.currentModule = action.payload
    },
    
    toggleConfigModal: (state) => {
      state.showConfigModal = !state.showConfigModal
    },
    
    setConfigModal: (state, action: PayloadAction<boolean>) => {
      state.showConfigModal = action.payload
    },
    
    toggleVoteResults: (state) => {
      state.showVoteResults = !state.showVoteResults
    },
    
    setVoteResults: (state, action: PayloadAction<boolean>) => {
      state.showVoteResults = action.payload
    },
    
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode
    },
    
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    
    clearError: (state) => {
      state.error = null
    }
  }
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setCurrentModule,
  toggleConfigModal,
  setConfigModal,
  toggleVoteResults,
  setVoteResults,
  toggleDarkMode,
  setDarkMode,
  setLoading,
  setError,
  clearError
} = uiSlice.actions

export default uiSlice.reducer