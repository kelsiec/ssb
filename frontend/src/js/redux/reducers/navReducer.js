import { OPEN_NAV, CLOSE_NAV } from '../types/MessagesTypes'

export default (state = { navDrawerOpen: false }, action) => {
  switch (action.type) {
    case OPEN_NAV:
      return {
        ...state,
        navDrawerOpen: true,
      }
    case CLOSE_NAV:
      return {
        ...state,
        navDrawerOpen: false,
      }
    default:
      return state
  }
}
