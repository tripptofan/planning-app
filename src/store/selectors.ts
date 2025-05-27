// src/store/selectors.ts
import { createSelector } from '@reduxjs/toolkit'
import type { RootState } from './index'
import type { ReviewItem } from './slices/sessionSlice'
import type { Participant } from './slices/participantsSlice'
import type { Vote } from './slices/votingSlice'

// Session selectors
export const selectSession = (state: RootState) => state.session
export const selectSessionId = (state: RootState) => state.session.id
export const selectSessionLeaderId = (state: RootState) => state.session.leaderId
export const selectIsSessionActive = (state: RootState) => state.session.isActive
export const selectReviewItems = (state: RootState) => state.session.reviewItems
export const selectCurrentItemId = (state: RootState) => state.session.currentItemId
export const selectSessionConfig = (state: RootState) => state.session.config

export const selectCurrentReviewItem = createSelector(
  [selectReviewItems, selectCurrentItemId],
  (reviewItems, currentItemId) => 
    reviewItems.find((item: ReviewItem) => item.id === currentItemId) || null
)

export const selectRemainingReviewItems = createSelector(
  [selectReviewItems],
  (reviewItems) => reviewItems.filter((item: ReviewItem) => !item.isCompleted)
)

// Participants selectors
export const selectCurrentUserId = (state: RootState) => state.participants.currentUserId
export const selectAllParticipants = (state: RootState) => state.participants.participants
export const selectCurrentUser = createSelector(
  [selectAllParticipants, selectCurrentUserId],
  (participants, currentUserId) => 
    participants.find((p: Participant) => p.id === currentUserId) || null
)

export const selectOnlineParticipants = createSelector(
  [selectAllParticipants],
  (participants) => participants.filter((p: Participant) => p.isOnline)
)

export const selectParticipantsWhoVoted = createSelector(
  [selectAllParticipants],
  (participants) => participants.filter((p: Participant) => p.hasVoted)
)

export const selectLeader = createSelector(
  [selectAllParticipants],
  (participants) => participants.find((p: Participant) => p.role === 'leader') || null
)

export const selectIsCurrentUserLeader = createSelector(
  [selectCurrentUser],
  (currentUser) => currentUser?.role === 'leader' || false
)

// Voting selectors
export const selectCurrentVotingRound = (state: RootState) => state.voting.currentRound
export const selectVotingHistory = (state: RootState) => state.voting.votingHistory
export const selectIsVotingActive = (state: RootState) => state.voting.isVotingActive
export const selectIsTimerActive = (state: RootState) => state.voting.isTimerActive
export const selectTimerSecondsLeft = (state: RootState) => state.voting.timerSecondsLeft

export const selectCurrentRoundVotes = createSelector(
  [selectCurrentVotingRound],
  (currentRound) => currentRound?.votes || []
)

export const selectCurrentUserVote = createSelector(
  [selectCurrentRoundVotes, selectCurrentUserId],
  (votes, currentUserId) => 
    votes.find((vote: Vote) => vote.participantId === currentUserId) || null
)

export const selectVoteCount = createSelector(
  [selectCurrentRoundVotes],
  (votes) => votes.length
)

export const selectVoteSummary = createSelector(
  [selectCurrentRoundVotes],
  (votes) => {
    const summary: { [key: string]: number } = {}
    votes.forEach((vote: Vote) => {
      summary[vote.voteValue] = (summary[vote.voteValue] || 0) + 1
    })
    return summary
  }
)

// UI selectors
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen
export const selectCurrentModule = (state: RootState) => state.ui.currentModule
export const selectShowConfigModal = (state: RootState) => state.ui.showConfigModal
export const selectShowVoteResults = (state: RootState) => state.ui.showVoteResults
export const selectDarkMode = (state: RootState) => state.ui.darkMode
export const selectLoading = (state: RootState) => state.ui.loading
export const selectError = (state: RootState) => state.ui.error

// Combined selectors
export const selectSessionStatus = createSelector(
  [selectIsSessionActive, selectCurrentReviewItem, selectIsVotingActive],
  (isActive, currentItem, isVoting) => ({
    isActive,
    hasCurrentItem: !!currentItem,
    isVoting,
    canStartVoting: isActive && !!currentItem && !isVoting
  })
)

export const selectVotingProgress = createSelector(
  [selectOnlineParticipants, selectParticipantsWhoVoted],
  (onlineParticipants, votedParticipants) => {
    const totalOnline = onlineParticipants.filter((p: Participant) => p.role === 'participant').length
    const totalVoted = votedParticipants.filter((p: Participant) => p.role === 'participant').length
    
    return {
      totalParticipants: totalOnline,
      votedCount: totalVoted,
      allVoted: totalOnline > 0 && totalVoted === totalOnline,
      percentage: totalOnline > 0 ? Math.round((totalVoted / totalOnline) * 100) : 0
    }
  }
)