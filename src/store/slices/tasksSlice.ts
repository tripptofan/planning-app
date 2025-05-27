// src/store/slices/tasksSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  projectId?: string
  createdAt: string
  updatedAt: string
}

interface TasksState {
  items: Task[]
  filter: 'all' | 'active' | 'completed'
  sortBy: 'dueDate' | 'priority' | 'created'
}

const initialState: TasksState = {
  items: [],
  filter: 'all',
  sortBy: 'created'
}

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => {
      const now = new Date().toISOString()
      const newTask: Task = {
        ...action.payload,
        id: uuidv4(),
        createdAt: now,
        updatedAt: now
      }
      state.items.push(newTask)
    },
    
    updateTask: (state, action: PayloadAction<{ id: string; updates: Partial<Task> }>) => {
      const { id, updates } = action.payload
      const taskIndex = state.items.findIndex(task => task.id === id)
      if (taskIndex !== -1) {
        state.items[taskIndex] = {
          ...state.items[taskIndex],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    },
    
    deleteTask: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(task => task.id !== action.payload)
    },
    
    toggleTaskComplete: (state, action: PayloadAction<string>) => {
      const task = state.items.find(task => task.id === action.payload)
      if (task) {
        task.completed = !task.completed
        task.updatedAt = new Date().toISOString()
      }
    },
    
    setFilter: (state, action: PayloadAction<TasksState['filter']>) => {
      state.filter = action.payload
    },
    
    setSortBy: (state, action: PayloadAction<TasksState['sortBy']>) => {
      state.sortBy = action.payload
    }
  }
})

export const {
  addTask,
  updateTask,
  deleteTask,
  toggleTaskComplete,
  setFilter,
  setSortBy
} = tasksSlice.actions

export default tasksSlice.reducer