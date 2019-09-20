import { OPEN_NAV, CLOSE_NAV } from '../types/MessagesTypes'

export const openNav = () => {
  return {
    type: OPEN_NAV,
    payload: null,
  }
}

export const closeNav = () => {
  return {
    type: CLOSE_NAV,
    payload: null,
  }
}
