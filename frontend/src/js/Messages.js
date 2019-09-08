import { addMessages, removeMessage } from './redux/actions/actions'

export function showNotificationWithTimeout (dispatch, payload) {
  const uids = []
  payload.forEach((element) => {
    const uid = '_' + Math.random().toString(36).substr(2, 9)
    uids.push(uid)
    element.uid = uid
  })

  dispatch(addMessages(payload))

  uids.forEach((uid) => {
    setTimeout(() => {
      dispatch(removeMessage(uid))
    }, 5000)
  })
}
