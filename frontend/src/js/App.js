import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { BrowserRouter, Route } from 'react-router-dom'
import { connect } from 'react-redux'

import PropTypes from 'prop-types'

import '../css/App.scss'
import Nav from './nav/Nav.js'

import PoseForm from './poses/Form'
import PoseTable from './poses/Table'
import SequenceForm from './sequences/SequenceForm'
import SequenceTable from './sequences/SequenceTable'
import VariantSnackbar from './nav/VariantSnackbar'

class App extends React.Component {
  render () {
    return (
      <div className="container">
        <div id="messages">
          <ReactCSSTransitionGroup
            transitionName="message"
            transitionEnter={true}
            transitionEnterTimeout={1000}
            transitionLeave={true}
            transitionLeaveTimeout={1000}>
            {this.props.messagesReducer.messages.map((message, index) =>
              <VariantSnackbar
                key={'message-' + index}
                message={<span>{message.message}</span>}
                uid={message.uid}
                variant={message.variant}
                style={{ bottom: 50 }}
              />
            )}
          </ReactCSSTransitionGroup>
        </div>
        <BrowserRouter>
          <div style={{ paddingLeft: 24, paddingRight: 24 }}>
            <Route path="/" render={(props) => <Nav {...props} {...this.props} />} />
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
  messagesReducer: PropTypes.object.isRequired,
}

export default connect(state => ({ ...state }))(App)
