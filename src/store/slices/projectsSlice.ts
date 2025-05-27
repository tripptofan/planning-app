// src/store/slices/projectsSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface Project {
  id: string
  name: string
  description?: string
  color: string
  status: 'active' | 'completed' | 'archived'
  createdAt: string
  updatedAt: string
}

interface ProjectsState {
  items: Project[]
  activeProjectId: string | null
}

const initialState: ProjectsState = {
  items: [],
  activeProjectId: null
}

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    addProject: (state, action: PayloadAction<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString()
      const newProject: Project = {
        ...action.payload,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      }
      state.items.push(newProject)
      
      // Set as active project if it's the first one
      if (state.items.length === 1) {
        state.activeProjectId = newProject.id
      }
    },
    
    updateProject: (state, action: PayloadAction<{ id: string; updates: Partial<Project> }>) => {
      const { id, updates } = action.payload
      const projectIndex = state.items.findIndex(project => project.id === id)
      if (projectIndex !== -1) {
        state.items[projectIndex] = {
          ...state.items[projectIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    },
    
    deleteProject: (state, action: PayloadAction<string>) => {
      const projectId = action.payload
      state.items = state.items.filter(project => project.id !== projectId)
      
      // If deleted project was active, set new active project
      if (state.activeProjectId === projectId) {
        state.activeProjectId = state.items.length > 0 ? state.items[0].id : null
      }
    },
    
    setActiveProject: (state, action: PayloadAction<string | null>) => {
      state.activeProjectId = action.payload
    }
  }
})

export const {
  addProject,
  updateProject,
  deleteProject,
  setActiveProject
} = projectsSlice.actions

export default projectsSlice.reducer