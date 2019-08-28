import React from 'react'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import Select from 'react-select'

import Cookies from 'universal-cookie'

import 'react-select/dist/react-select.css'

import VariantSnackbar from '../VariantSnackbar'

const defaultState = {
  breath: '',
  benefitsOptions: null,
  challengeLevel: null,
  compensationOptions: null,
  messages: [],
  positionClassification: null,
  preparationOptions: null,
  spinalClassification: null,
}

class PoseForm extends React.Component {
  constructor (props) {
    super(props)

    this.cookies = new Cookies()

    this.state = defaultState
    this.state['messages'] = []
  }

  handleInputChange = (input, event) => {
    this.setState({
      [input]: event,
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)

    fetch('/poses/create_pose/submit/', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'X-CSRFToken': this.cookies.get('csrftoken'),
      },
      body: data,
    }).then(function (response) {
      if (response.ok) {
        this.setState(defaultState)
      }
      return response.json()
    }.bind(this)).then(function (data) {
      this.setState({messages: data['messages']})
    }.bind(this))
  }

  static loadBreathOptions () {
    return fetch('/poses/breath_directions/')
      .then(response => response.json())
      .then(json => {
        return {options: json.map((entry) => {
          return {'value': entry['id'], 'label': entry['direction']}
        })}
      })
  }

  static loadChallengeLevelOptions () {
    return fetch('/poses/challenge_levels/')
      .then(response => response.json())
      .then(json => { return {options: json} })
  }

  static loadPositionClassificationOptions () {
    return fetch('/poses/position_classifications/')
      .then(response => response.json())
      .then(json => { return {options: json} })
  }

  static loadSpinalClassificationOptions () {
    return fetch('/poses/spinal_classifications/')
      .then(response => response.json())
      .then(json => { return {options: json} })
  }

  loadEffectOptions = (input) => {
    return fetch('/poses/effects/')
      .then(response => response.json())
      .then(json => {
        return { options: json }
      })
  }

  render () {
    return (
      <div className="container">
        <div id="messages">
          {this.state.messages.map((message, index) =>
            <VariantSnackbar
              key={'message-' + index}
              message={<span>{message['message']}</span>}
              variant={message['variant']}
            />
          )}
        </div>
        <h3>Submit a New Pose</h3>
        <form id='pose-form' onSubmit={this.handleSubmit}>
          <input type='hidden' name='csrfmiddlewaretoken' value={this.cookies.get('csrftoken')} />
          <div className="container" style={{display: 'flex', marginBottom: 20}}>
            <TextField
              fullWidth={true}
              label="English Name"
              name="english_name"
              required
              style={{marginRight: 20}}
            />
            <TextField
              fullWidth={true}
              label="Sanskrit Name"
              name="sanskrit_name"
              required
              style={{marginRight: 20}}
            />
            <div style={{width: '100%'}} />
            <div style={{width: '100%'}} />
          </div>
          <div className="container" style={{display: 'flex', marginBottom: 20}}>
            <Select.Async
              loadOptions={PoseForm.loadBreathOptions}
              name="breath"
              onChange={(event) => this.handleInputChange('breath', event)}
              placeholder="Breath Direction"
              required
              value={this.state.breath}
            />
            <Select.Async
              loadOptions={PoseForm.loadSpinalClassificationOptions}
              name="spinal_classification"
              onChange={(event) => this.handleInputChange('spinalClassification', event)}
              placeholder="Spinal Classification"
              required
              value={this.state.spinalClassification}
            />
            <Select.Async
              loadOptions={PoseForm.loadPositionClassificationOptions}
              name="position_classification"
              onChange={(event) => this.handleInputChange('positionClassification', event)}
              placeholder="Body Position"
              required
              value={this.state.positionClassification}
            />
            <Select.Async
              loadOptions={PoseForm.loadChallengeLevelOptions}
              name="challenge_level"
              onChange={(event) => this.handleInputChange('challengeLevel', event)}
              placeholder="Challenge Level"
              required
              value={this.state.challengeLevel}
            />
          </div>
          <div className="container" style={{display: 'flex', marginBottom: 20}}>
            <Select.Async
              loadOptions={this.loadEffectOptions}
              multi
              name="benefits"
              onChange={(event) => this.handleInputChange('benefitsOptions', event)}
              placeholder="Benefits"
              required
              value={this.state.benefitsOptions}
            />
            <Select.Async
              loadOptions={this.loadEffectOptions}
              multi
              name="preparation"
              onChange={(event) => this.handleInputChange('preparationOptions', event)}
              placeholder="Preparation"
              value={this.state.preparationOptions}
            />
            <Select.Async
              loadOptions={this.loadEffectOptions}
              multi
              name="compensation"
              onChange={(event) => this.handleInputChange('compensationOptions', event)}
              placeholder="Compensation"
              value={this.state.compensationOptions}
            />
          </div>
          <div className="container" style={{display: 'flex'}}>
            <Button name="save_pose" variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

export default PoseForm
