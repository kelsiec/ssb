import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import { configureStore } from '../../frontend/src/js/redux/store'
import App from '../../frontend/src/js/App'

ReactDOM.render(
  <Provider store={configureStore()}>
    <App />
  </Provider>,
  document.getElementById('app')
)
