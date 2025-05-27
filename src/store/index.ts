// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit'
import tasksReducer from './slices/tasksSlice'
import projectsReducer from './slices/projectsSlice'
import uiReducer from './slices/uiSlice'
import sessionReducer from './slices/sessionSlice'
import participantsReducer from './slices/participantsSlice'
import votingReducer from './slices/votingSlice'

export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    projects: projectsReducer,
    ui: uiReducer,
    session: sessionReducer,
    participants: participantsReducer,
    voting: votingReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch