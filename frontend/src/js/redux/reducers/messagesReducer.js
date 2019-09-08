export default (state = { messages: [] }, action) => {
  switch (action.type) {
    case 'addMessage':
      return {
        ...state,
        messages: state.messages.concat(action.payload),
      }
    case 'removeMessage':
      state.messages.splice(action.payload, 1)
      return {
        ...state,
        messages: state.messages,
      }
    default:
      return state
  }
}
