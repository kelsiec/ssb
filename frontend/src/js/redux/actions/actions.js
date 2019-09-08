export const addMessage = (messages) => {
  return {
    type: 'addMessage',
    payload: messages,
  }
}

export const removeMessage = (index) => {
  return {
    type: 'removeMessage',
    payload: index,
  }
}
