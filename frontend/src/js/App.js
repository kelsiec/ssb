import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter, Route } from 'react-router-dom'

import '../css/App.scss'
import Nav from './Nav.js'
import PoseTable from './PoseTable'

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" component={Nav} />
          <Route exact path="/poses/view_poses" component={PoseTable} />
        </div>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
