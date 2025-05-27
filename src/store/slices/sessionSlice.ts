// src/store/slices/sessionSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export interface ReviewItem {
  id: string
  name: string
  isCurrentItem: boolean
  isCompleted: boolean
  finalPoints?: number
  addedAt: string
}

export interface VoteCard {
  id: string
  value: string // Could be numbers like "1", "2", "3" or special cards like "?", "∞"
  label: string
}

export interface SessionConfig {
  timerDuration: number // in seconds
  voteCards: VoteCard[]
  allowRevoting: boolean
}

interface SessionState {
  id: string | null
  leaderId: string | null
  isActive: boolean
  reviewItems: ReviewItem[]
  currentItemId: string | null
  config: SessionConfig
  createdAt: string | null
}

const defaultVoteCards: VoteCard[] = [
  { id: '1', value: '1', label: '1' },
  { id: '2', value: '2', label: '2' },
  { id: '3', value: '3', label: '3' },
  { id: '5', value: '5', label: '5' },
  { id: '8', value: '8', label: '8' },
  { id: '13', value: '13', label: '13' },
  { id: '21', value: '21', label: '21' },
  { id: '?', value: '?', label: '?' },
]

const initialState: SessionState = {
  id: null,
  leaderId: null,
  isActive: false,
  reviewItems: [],
  currentItemId: null,
  config: {
    timerDuration: 120, // 2 minutes default
    voteCards: defaultVoteCards,
    allowRevoting: false
  },
  createdAt: null
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    createSession: (state, action: PayloadAction<{ leaderId: string }>) => {
      const now = new Date().toISOString()
      state.id = uuidv4()
      state.leaderId = action.payload.leaderId
      state.isActive = true
      state.createdAt = now
      state.reviewItems = []
      state.currentItemId = null
    },
    
    endSession: (state) => {
      state.isActive = false
    },
    
    addReviewItem: (state, action: PayloadAction<string>) => {
      const newItem: ReviewItem = {
        id: uuidv4(),
        name: action.payload,
        isCurrentItem: false,
        isCompleted: false,
        addedAt: new Date().toISOString()
      }
      state.reviewItems.push(newItem)
      
      // If this is the first item, make it current
      if (state.reviewItems.length === 1) {
        newItem.isCurrentItem = true
        state.currentItemId = newItem.id
      }
    },
    
    removeReviewItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload
      const itemIndex = state.reviewItems.findIndex(item => item.id === itemId)
      
      if (itemIndex !== -1) {
        const wasCurrentItem = state.reviewItems[itemIndex].isCurrentItem
        state.reviewItems.splice(itemIndex, 1)
        
        // If we removed the current item, set the next item as current
        if (wasCurrentItem && state.reviewItems.length > 0) {
          const nextItem = state.reviewItems[0]
          nextItem.isCurrentItem = true
          state.currentItemId = nextItem.id
        } else if (state.reviewItems.length === 0) {
          state.currentItemId = null
        }
      }
    },
    
    setCurrentReviewItem: (state, action: PayloadAction<string>) => {
      const itemId = action.payload
      
      // Clear current item flag from all items
      state.reviewItems.forEach(item => {
        item.isCurrentItem = false
      })
      
      // Set new current item
      const newCurrentItem = state.reviewItems.find(item => item.id === itemId)
      if (newCurrentItem) {
        newCurrentItem.isCurrentItem = true
        state.currentItemId = itemId
      }
    },
    
    completeCurrentItem: (state, action: PayloadAction<{ finalPoints: number }>) => {
      const currentItem = state.reviewItems.find(item => item.isCurrentItem)
      if (currentItem) {
        currentItem.isCompleted = true
        currentItem.finalPoints = action.payload.finalPoints
        currentItem.isCurrentItem = false
        
        // Remove completed item
        state.reviewItems = state.reviewItems.filter(item => item.id !== currentItem.id)
        
        // Set next item as current
        if (state.reviewItems.length > 0) {
          const nextItem = state.reviewItems[0]
          nextItem.isCurrentItem = true
          state.currentItemId = nextItem.id
        } else {
          state.currentItemId = null
        }
      }
    },
    
    updateSessionConfig: (state, action: PayloadAction<Partial<SessionConfig>>) => {
      state.config = { ...state.config, ...action.payload }
    }
  }
})

export const {
  createSession,
  endSession,
  addReviewItem,
  removeReviewItem,
  setCurrentReviewItem,
  completeCurrentItem,
  updateSessionConfig
} = sessionSlice.actions

export default sessionSlice.reducer