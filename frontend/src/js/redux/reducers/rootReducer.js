import { combineReducers } from 'redux'
import messagesReducer from './messagesReducer'
import navReducer from './navReducer'

export const rootReducer = combineReducers({
  messagesReducer,
  navReducer,
})
