import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  openMatchup: ['matchupID'],
  voteOnMatchup: ['matchupID', 'sideVotes']
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetching: false,
  error: null,
  sideVotes: [],
  matchup: null
})

/* ------------- Reducers ------------- */
export const openMatchup = (state, action) => {
  const { matchup } = action
  return state.merge({ fetching: false, error: null, matchup })
}
export const voteMatchup = (state, action) => {
  const { sideVotes } = action
  return state.merge({ fetching: false, error: null, sideVotes })
}
export const createMatchup = (state, action) => {
  const { matchup } = action
  return state.merge({ fetching: false, error: null, matchup })
}
export const editMatchup = (state, action) => {
  const { matchup } = action
  return state.merge({ fetching: false, error: null, matchup })
}
export const deleteMatchuo = (state, action) => {
  const { matchup } = action
  return state.merge({ fetching: false, error: null, matchup })
}


// failed to get the avatar

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.OPEN_MATCHUP]: openMatchup,
  [Types.VOTE_ON_MATCHUP]: voteMatchup
})
