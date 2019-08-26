import React from 'react'
import ReactDOM from 'react-dom'

import { BrowserRouter, Route } from 'react-router-dom'
import '../css/App.scss'
import Nav from './Nav.js'
import SequenceForm from './sequences/SequenceForm'
import PoseForm from './poses/Form'
import PoseTable from './poses/Table'

class App extends React.Component {
  render () {
    return (
      <BrowserRouter>
        <div>
          <Route path="/" component={Nav} />
          <Route exact path="/poses/create_pose" component={PoseForm} />
          <Route exact path="/poses/view_poses" component={PoseTable} />
          <Route path="/sequences/sequence/:id?" component={SequenceForm}/>
        </div>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'))
