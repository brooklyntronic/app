import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import Utilities from '../Services/Utilities'
/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  loggedIn: null,
  attempt: ['username', 'password'],
  loginSuccess: ['user'],
  loginFailure: null,
  checkLoggedIn: null,
  requestWithDefaultValues: { username: 'guest', password: null },
  logout: null,
  switchPhone: null,
  voteOnMatchup: ['matchup', 'user']
})

export const UserTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  user: {},
  fetching: false,
  error: null,
  emailSwitchIsOn: true,
  loggedIn: false,
  sideVotes: []
})

/* ------------- Reducers ------------- */
// user switches phone/email
export const changePhoneInput = (state) =>
  state.merge({emailSwitchIsOn: !emailSwitchIsOn})

// see if user is logged in
export const checkLoggedIn = (state) => {
  fetch(Utilities.baseUrl + 'users/loggedIn',  {credentials: 'include'})
    .then(function (resp){ if(resp.status===200)
      { window.alert(resp)
        return state.merge({fetching: false, loggedIn: true})
    } else {
      return state.merge({fetching: false, error: resp.status})
    } })
    .catch((err)=>{return state.merge({error: err, fetching: false})})
    .done()
}
// user attempt login
export const attempt = (state, { username, password }) =>
  state.merge({ fetching: true, username, password })

// user succeed login
export const success = (state, user) => {
  return state.merge({ fetching: false, error: false, user })
}

// user fail login
export const failure = (state) =>
  state.merge({ fetching: false, error: true })

export const vote = (state, matchup) =>
  state.merge({sideVotes, matchup})
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.CHECK_LOGGED_IN]: checkLoggedIn,
  [Types.LOGIN_ATTEMPT]: attempt,
  [Types.LOGIN_SUCCESS]: success,
  [Types.LOGIN_FAILURE]: failure,
  [Types.SWITCH_PHONE]: changePhoneInput,
  [Types.VOTE_ON_MATCHUP]: vote
})
