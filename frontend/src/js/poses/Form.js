import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'

import AsyncSelect from 'react-select/async'

import Cookies from 'universal-cookie'

import { showNotificationWithTimeout } from '../Messages'

const defaultState = {
  breath: null,
  benefitsOptions: null,
  challengeLevel: null,
  compensationOptions: null,
  positionClassification: null,
  preparationOptions: null,
  spinalClassification: null,
}

class PoseForm extends React.Component {
  constructor (props) {
    super(props)

    this.cookies = new Cookies()

    this.state = defaultState
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
      showNotificationWithTimeout(this.props.dispatch, data.messages)
    })
  }

  static loadBreathOptions (inputValue) {
    return fetch('/poses/breath_directions/')
      .then(response => response.json())
      .then(json => { return json })
  }

  static loadChallengeLevelOptions (inputValue) {
    return fetch('/poses/challenge_levels/')
      .then(response => response.json())
      .then(json => { return json })
  }

  static loadPositionClassificationOptions (inputValue) {
    return fetch('/poses/position_classifications/')
      .then(response => response.json())
      .then(json => { return json })
  }

  static loadSpinalClassificationOptions (inputValue) {
    return fetch('/poses/spinal_classifications/')
      .then(response => response.json())
      .then(json => { return json })
  }

  static loadEffectOptions = (inputValue) => {
    return fetch('/poses/effects/')
      .then(response => response.json())
      .then(json => { return json })
  }

  render () {
    return (
      <div className="container">
        <h3>Submit a New Pose</h3>
        <form id='pose-form' onSubmit={this.handleSubmit}>
          <input type='hidden' name='csrfmiddlewaretoken' value={this.cookies.get('csrftoken')}/>
          <div className="container" style={{ display: 'flex', marginBottom: 20 }}>
            <TextField
              fullWidth={true}
              label="English Name"
              name="english_name"
              required
              style={{ marginRight: 20 }}
            />
            <TextField
              fullWidth={true}
              label="Sanskrit Name"
              name="sanskrit_name"
              required
              style={{ marginRight: 20 }}
            />
            <div style={{ width: '100%' }}/>
            <div style={{ width: '100%' }}/>
          </div>
          <div className="container" style={{ display: 'flex', marginBottom: 20 }}>
            <AsyncSelect
              defaultOptions
              loadOptions={PoseForm.loadBreathOptions}
              name="breath"
              onChange={(event) => this.handleInputChange('breath', event)}
              placeholder="Breath Direction"
              required
              value={this.state.breath}
              styles={{ container: base => ({ ...base, flex: 1, paddingRight: 10 }) }}
            />
            <AsyncSelect
              defaultOptions
              loadOptions={PoseForm.loadSpinalClassificationOptions}
              name="spinal_classification"
              onChange={(event) => this.handleInputChange('spinalClassification', event)}
              placeholder="Spinal Classification"
              required
              value={this.state.spinalClassification}
              styles={{ container: base => ({ ...base, flex: 1, paddingRight: 10 }) }}
            />
            <AsyncSelect
              defaultOptions
              loadOptions={PoseForm.loadPositionClassificationOptions}
              name="position_classification"
              onChange={(event) => this.handleInputChange('positionClassification', event)}
              placeholder="Body Position"
              required
              value={this.state.positionClassification}
              styles={{ container: base => ({ ...base, flex: 1, paddingRight: 10 }) }}
            />
            <AsyncSelect
              defaultOptions
              loadOptions={PoseForm.loadChallengeLevelOptions}
              name="challenge_level"
              onChange={(event) => this.handleInputChange('challengeLevel', event)}
              placeholder="Challenge Level"
              required
              value={this.state.challengeLevel}
              styles={{ container: base => ({ ...base, flex: 1 }) }}
            />
          </div>
          <div className="container" style={{ display: 'flex', marginBottom: 20 }}>
            <AsyncSelect
              defaultOptions
              loadOptions={PoseForm.loadEffectOptions}
              multi
              name="benefits"
              onChange={(event) => this.handleInputChange('benefitsOptions', event)}
              placeholder="Benefits"
              required
              value={this.state.benefitsOptions}
              styles={{ container: base => ({ ...base, flex: 1, paddingRight: 10 }) }}
            />
            <AsyncSelect
              defaultOptions
              loadOptions={PoseForm.loadEffectOptions}
              multi
              name="preparation"
              onChange={(event) => this.handleInputChange('preparationOptions', event)}
              placeholder="Preparation"
              value={this.state.preparationOptions}
              styles={{ container: base => ({ ...base, flex: 1, paddingRight: 10 }) }}
            />
            <AsyncSelect
              defaultOptions
              loadOptions={PoseForm.loadEffectOptions}
              multi
              name="compensation"
              onChange={(event) => this.handleInputChange('compensationOptions', event)}
              placeholder="Compensation"
              value={this.state.compensationOptions}
              styles={{ container: base => ({ ...base, flex: 1 }) }}
            />
          </div>
          <div className="container" style={{ display: 'flex' }}>
            <Button name="save_pose" variant="contained" color="primary" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    )
  }
}

PoseForm.propTypes = {
  dispatch: PropTypes.func.isRequired,
}

export default PoseForm
