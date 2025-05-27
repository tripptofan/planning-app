// src/store/slices/votingSlice.ts
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Vote {
  participantId: string
  voteValue: string
  timestamp: string
}

export interface VotingRound {
  id: string
  reviewItemId: string
  votes: Vote[]
  isActive: boolean
  startedAt: string
  endedAt?: string
  timerStartedAt?: string
  timerEndedAt?: string
}

interface VotingState {
  currentRound: VotingRound | null
  votingHistory: VotingRound[]
  isVotingActive: boolean
  isTimerActive: boolean
  timerSecondsLeft: number
}

const initialState: VotingState = {
  currentRound: null,
  votingHistory: [],
  isVotingActive: false,
  isTimerActive: false,
  timerSecondsLeft: 0
}

const votingSlice = createSlice({
  name: 'voting',
  initialState,
  reducers: {
    startVotingRound: (state, action: PayloadAction<{ reviewItemId: string; timerDuration: number }>) => {
      const { reviewItemId, timerDuration } = action.payload
      const now = new Date().toISOString()
      
      state.currentRound = {
        id: `round_${Date.now()}`,
        reviewItemId,
        votes: [],
        isActive: true,
        startedAt: now
      }
      state.isVotingActive = true
      state.timerSecondsLeft = timerDuration
    },
    
    endVotingRound: (state) => {
      if (state.currentRound) {
        state.currentRound.isActive = false
        state.currentRound.endedAt = new Date().toISOString()
        
        // Move to history
        state.votingHistory.push(state.currentRound)
        state.currentRound = null
      }
      state.isVotingActive = false
      state.isTimerActive = false
      state.timerSecondsLeft = 0
    },
    
    submitVote: (state, action: PayloadAction<{ participantId: string; voteValue: string }>) => {
      if (state.currentRound && state.isVotingActive) {
        const { participantId, voteValue } = action.payload
        
        // Remove existing vote from this participant (for revoting)
        state.currentRound.votes = state.currentRound.votes.filter(
          vote => vote.participantId !== participantId
        )
        
        // Add new vote
        const newVote: Vote = {
          participantId,
          voteValue,
          timestamp: new Date().toISOString()
        }
        state.currentRound.votes.push(newVote)
      }
    },
    
    clearVote: (state, action: PayloadAction<string>) => {
      if (state.currentRound) {
        state.currentRound.votes = state.currentRound.votes.filter(
          vote => vote.participantId !== action.payload
        )
      }
    },
    
    startTimer: (state, action: PayloadAction<number>) => {
      state.isTimerActive = true
      state.timerSecondsLeft = action.payload
      if (state.currentRound) {
        state.currentRound.timerStartedAt = new Date().toISOString()
      }
    },
    
    stopTimer: (state) => {
      state.isTimerActive = false
      if (state.currentRound && !state.currentRound.timerEndedAt) {
        state.currentRound.timerEndedAt = new Date().toISOString()
      }
    },
    
    resetTimer: (state, action: PayloadAction<number>) => {
      state.timerSecondsLeft = action.payload
      state.isTimerActive = false
    },
    
    tickTimer: (state) => {
      if (state.isTimerActive && state.timerSecondsLeft > 0) {
        state.timerSecondsLeft -= 1
        
        // Auto-stop timer when it reaches 0
        if (state.timerSecondsLeft === 0) {
          state.isTimerActive = false
          if (state.currentRound && !state.currentRound.timerEndedAt) {
            state.currentRound.timerEndedAt = new Date().toISOString()
          }
        }
      }
    },
    
    revealVotes: (state) => {
      // This action doesn't change state but signals that votes should be shown
      // The UI will use this to trigger vote revelation
    },
    
    clearVotingHistory: (state) => {
      state.votingHistory = []
    }
  }
})

export const {
  startVotingRound,
  endVotingRound,
  submitVote,
  clearVote,
  startTimer,
  stopTimer,
  resetTimer,
  tickTimer,
  revealVotes,
  clearVotingHistory
} = votingSlice.actions

export default votingSlice.reducer