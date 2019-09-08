import React from 'react'

import { BrowserRouter, Route } from 'react-router-dom'

import { connect } from 'react-redux'

import '../css/App.scss'
import Nav from './nav/Nav.js'

import PoseForm from './poses/Form'
import PoseTable from './poses/Table'
import SequenceForm from './sequences/SequenceForm'
import SequenceTable from './sequences/SequenceTable'
import VariantSnackbar from './nav/VariantSnackbar'
import PropTypes from 'prop-types'

class App extends React.Component {
  render () {
    return (
      <div className="container">
        <div id="messages">
          {this.props.messagesReducer.messages.map((message, index) =>
            <VariantSnackbar
              key={'message-' + index}
              message={<span>{message.message}</span>}
              index={index}
              variant={message.variant}
            />
          )}
        </div>
        <BrowserRouter>
          <div>
            <Route path="/" component={Nav} />
            <Route exact path="/poses/create_pose" render={(props) => <PoseForm {...props} {...this.props} />} />
            <Route exact path="/poses/view_poses" render={(props) => <PoseTable {...props} {...this.props} />} />
            <Route exact path="/sequences/" render={(props) => <SequenceTable {...props} {...this.props} />} />
            <Route path="/sequences/sequence/:id?" render={(props) => <SequenceForm {...props} {...this.props} />} />
          </div>
        </BrowserRouter>
      </div>
    )
  }
}

App.propTypes = {
  messagesReducer: PropTypes.func.isRequired,
}

export default connect(state => ({ ...state }))(App)
