// src/store/slices/participantsSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'

export type UserRole = 'leader' | 'participant'

export interface Participant {
  id: string
  name: string
  role: UserRole
  isOnline: boolean
  hasVoted: boolean
  joinedAt: string
}

interface ParticipantsState {
  currentUserId: string | null
  participants: Participant[]
}

const initialState: ParticipantsState = {
  currentUserId: null,
  participants: []
}

const participantsSlice = createSlice({
  name: 'participants',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<{ id: string; name: string; role: UserRole }>) => {
      const { id, name, role } = action.payload
      state.currentUserId = id
      
      // Add current user to participants if not already present
      const existingUser = state.participants.find(p => p.id === id)
      if (!existingUser) {
        const newParticipant: Participant = {
          id,
          name,
          role,
          isOnline: true,
          hasVoted: false,
          joinedAt: new Date().toISOString()
        }
        state.participants.push(newParticipant)
      }
    },
    
    addParticipant: (state, action: PayloadAction<{ name: string; role?: UserRole }>) => {
      const newParticipant: Participant = {
        id: uuidv4(),
        name: action.payload.name,
        role: action.payload.role || 'participant',
        isOnline: true,
        hasVoted: false,
        joinedAt: new Date().toISOString()
      }
      state.participants.push(newParticipant)
    },
    
    removeParticipant: (state, action: PayloadAction<string>) => {
      state.participants = state.participants.filter(p => p.id !== action.payload)
    },
    
    setParticipantOnlineStatus: (state, action: PayloadAction<{ id: string; isOnline: boolean }>) => {
      const participant = state.participants.find(p => p.id === action.payload.id)
      if (participant) {
        participant.isOnline = action.payload.isOnline
      }
    },
    
    setParticipantVoteStatus: (state, action: PayloadAction<{ id: string; hasVoted: boolean }>) => {
      const participant = state.participants.find(p => p.id === action.payload.id)
      if (participant) {
        participant.hasVoted = action.payload.hasVoted
      }
    },
    
    resetAllVoteStatus: (state) => {
      state.participants.forEach(participant => {
        participant.hasVoted = false
      })
    },
    
    clearParticipants: (state) => {
      state.participants = []
      state.currentUserId = null
    }
  }
})

export const {
  setCurrentUser,
  addParticipant,
  removeParticipant,
  setParticipantOnlineStatus,
  setParticipantVoteStatus,
  resetAllVoteStatus,
  clearParticipants
} = participantsSlice.actions

export default participantsSlice.reducer