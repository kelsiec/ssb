import { ADD_MESSAGES, REMOVE_MESSAGE } from '../types/MessagesTypes'

export const addMessages = (messages) => {
  return {
    type: ADD_MESSAGES,
    payload: messages,
  }
}

export const removeMessage = (uid) => {
  return {
    type: REMOVE_MESSAGE,
    payload: uid,
  }
}
