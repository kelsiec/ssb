import { ADD_MESSAGES, REMOVE_MESSAGE } from '../types/MessagesTypes'

export default (state = { messages: [] }, action) => {
  switch (action.type) {
    case ADD_MESSAGES:
      return {
        ...state,
        messages: state.messages.concat(action.payload),
      }
    case REMOVE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter((value) => value.uid !== action.payload),
      }
    default:
      return state
  }
}
