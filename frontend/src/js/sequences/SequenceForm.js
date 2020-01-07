import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import TextField from '@material-ui/core/TextField'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos'
import DragHandle from '@material-ui/icons/DragHandle'
import DeleteIcon from '@material-ui/icons/Delete'

import arrayMove from 'array-move'
import Select from 'react-select'
import Cookies from 'universal-cookie'

import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'

import { showNotificationWithTimeout } from '../Messages'

const Drag = sortableHandle(() => <DragHandle/>)

const SortableItem = sortableElement(({ value, onDelete }) => (
  <div className="container" style={{
    width: '50%',
    padding: 20,
    marginBottom: 20,
    borderStyle: 'solid',
    borderSpacing: 20,
    borderRadius: 10,
  }}>
    <div style={{ display: 'flex', width: '100%' }}>
      <Drag styles={{ flex: 1 }}/>
      <RadioGroup aria-label="position" name="position" value={value} row style={{ flex: 1, justifyContent: 'center' }}>
        <FormControlLabel
          value="stay"
          control={<Radio color="primary" />}
          label="Stay"
          labelPlacement="start"
        />
        <FormControlLabel
          value="repeat"
          control={<Radio color="primary" />}
          label="Repeat"
          labelPlacement="start"
        />
      </RadioGroup>
      <DeleteIcon onClick={onDelete} styles={{ flex: 1, alignSelf: 'flex-end' }}/>
    </div>
    {value}
  </div>
))

const SortableContainer = sortableContainer(({ children }) => {
  return <div>{children}</div>
})

class SequenceForm extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    this.cookies = new Cookies()

    this.sequenceId = this.props.match.params.id ? this.props.match.params.id : ''
    this.poseLibrary = [{ english_name: '', spinal_classification: '' }]
    this.breathDirections = ['Inhale', 'Exhale', 'Either']

    this.state = {
      loadingSequence: this.sequenceId !== '',
      loadingPoses: true,
      name: '',
      poses: [{ id: -1, breath_direction: '' }],
    }
  }

  isLoading () {
    return this.state.loadingSequence || this.state.loadingPoses
  }

  componentDidMount () {
    if (this.sequenceId !== '') {
      this.loadSequence(this.sequenceId)
    }
    this.loadPoses()
  }

  loadSequence (sequenceId) {
    fetch('/sequences/sequence/' + sequenceId + '/')
      .then(response => response.json())
      .then(json => {
        this.setState({
          name: json.name,
          loadingSequence: false,
          poses: json.poses,
        })
      })
  }

  loadPoses () {
    fetch('/poses/poses/')
      .then(response => response.json())
      .then(json => {
        this.poseLibrary = json.reduce(function (map, obj) {
          map[obj.id] = obj
          return map
        }, {})
        this.setState({
          loadingPoses: false,
        })
      })
  }

  handleNameChange = (event) => {
    this.setState({ name: event.target.value })
  }

  handleAddPose = () => {
    this.setState({
      poses: this.state.poses.concat({ id: -1, breath_direction: '' }),
    })
  }

  handlePoseChange = (event, index) => {
    this.setState({
      poses: this.state.poses.map((item, mIndex) => {
        if (index !== mIndex) return item
        return {
          id: event.value,
          breath_direction: this.poseLibrary[event.value].breath,
        }
      }),
    })
  }

  handleBreathChange = (event, index) => {
    this.setState({
      poses: this.state.poses.map((item, mIndex) => {
        if (index !== mIndex) {
          return item
        } else {
          const updatedItem = item
          updatedItem.breath_direction = event.value
          return updatedItem
        }
      }),
    })
  }

  handlePoseRemove = (index) => {
    this.setState({
      poses: this.state.poses.filter((element, mIndex) => mIndex !== index),
    })
  }

  handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.target)

    fetch('/sequences/sequence/submit/', {
      credentials: 'include',
      method: 'POST',
      headers: {
        'X-CSRFToken': this.cookies.get('csrftoken'),
      },
      body: data,
    }).then(function (response) {
      return response.json()
    }).then(function (data) {
      showNotificationWithTimeout(this.props.dispatch, data.messages)
      this.props.history.push('/sequences/sequence/' + data.instance_id)
    }.bind(this))
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    this.setState(({ poses }) => ({
      poses: arrayMove(poses, oldIndex, newIndex),
    }))
  }

  getPoseData (index, item) {
    if (this.state.poses[index] != null && this.state.poses[index].id !== -1 &&
      this.poseLibrary[this.state.poses[index].id] != null) {
      return this.poseLibrary[this.state.poses[index].id][item]
    } else {
      return ''
    }
  }

  breathDirectionColor (index) {
    if (this.state.poses[index].breath_direction === 2) {
      return '#F1948A'
    } else if (index > 0 &&
        this.state.poses[index].breath_direction === this.state.poses[index - 1].breath_direction
    ) {
      return '#FFFF88'
    } else {
      return '#FFFFFF'
    }
  }

  spinalDirectionColor (index) {
    if (index === 0 || this.getPoseData(index, 'id') === '') {
      return '#FFFFFF'
    }

    // If the pose before this was an extension, find the most recent non-extension
    let indexToCompare = index - 1
    while (indexToCompare > 0 &&
      this.getPoseData(indexToCompare, 'spinal_classification') === 'Extension') {
      indexToCompare--
    }

    // If the pose is a forward bend or an extension or
    if (this.getPoseData(index, 'spinal_classification') === 'Extension' ||
      this.getPoseData(index, 'spinal_classification') === 'Forward Bend' ||
      // If the pose before this was a forward bend or the same direction
      this.getPoseData(indexToCompare, 'spinal_classification') === 'Forward Bend' ||
      this.getPoseData(index, 'spinal_classification') ===
      this.getPoseData(indexToCompare, 'spinal_classification')
    ) {
      return '#FFFFFF'
    } else {
      return '#F1948A'
    }
  }

  render () {
    return (
      <div className="container" key={'container'}>
        <div
          style={{ cursor: 'pointer', verticalAlign: 'middle' }}
          onClick={_ => this.props.history.push('/sequences/')}>
          <ArrowBackIosIcon/> Back to All Sequences
        </div>
        <h3>Submit a New Sequence</h3>
        {this.isLoading() ? <CircularProgress/> :
          <form id='sequence-form' onSubmit={this.handleSubmit}>
            <input type='hidden' name='csrfmiddlewaretoken' value={this.cookies.get('csrftoken')}/>
            <input type='hidden' name='sequence-id' value={this.sequenceId}/>
            <div className="container" style={{ display: 'flex', width: '50%', marginBottom: 20 }}>
              <TextField
                fullWidth={true}
                label="Sequence Name"
                id='sequence-name'
                name='sequence-name'
                required
                value={this.state.name}
                onChange={this.handleNameChange}
              />
            </div>
            <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
              {this.state.poses.map((pose, index) => (
                <SortableItem style={{ width: '100%' }} key={'pose-li-' + index} index={index} onDelete={() => this.handlePoseRemove(index)} value={
                  <div>
                    <div style={{ display: 'flex', width: '100%', marginBottom: 5 }}>
                      <Select
                        key={'pose-' + index}
                        name="poses"
                        placeholder="Poses"
                        options={
                          Object.entries(this.poseLibrary).map(([key, value]) => {
                            return { value: key, label: value.english_name }
                          })
                        }
                        onChange={(event) => this.handlePoseChange(event, index)}
                        value={{
                          value: this.state.poses[index] != null ? this.state.poses[index].id : '',
                          label: this.getPoseData(index, 'english_name'),
                        }}
                        styles={{
                          container: base => ({ ...base, flex: 2 }),
                          control: base => ({
                            ...base,
                            backgroundColor: this.spinalDirectionColor(index),
                          }),
                        }}
                      />
                    </div>
                    {this.state.poses[index] !== {} &&
                    <div style={{ display: 'flex', width: '100%' }}>
                      <Select
                        key={'pose-breath-direction-' + index}
                        name='pose-breath-direction'
                        placeholder='Breath Direction'
                        styles={{
                          container: base => ({ ...base, flex: 1 }),
                          control: base => ({
                            ...base,
                            backgroundColor: this.breathDirectionColor(index),
                          }),
                        }}
                        options={
                          this.breathDirections.filter((value, _) => value !== 'Either').map((value, index) => {
                            return { value: index, label: value }
                          })
                        }
                        onChange={(event) => this.handleBreathChange(event, index)}
                        value={{
                          value: this.state.poses[index] != null ? this.state.poses[index].breath_direction : '',
                          label: this.state.poses[index] != null ?
                            this.breathDirections[this.state.poses[index].breath_direction] : '',
                        }}
                      />
                      <div style={{ flex: 1 }} />
                      <TextField
                        type='number'
                        label='Duration'
                        key={'pose-duration-' + index}
                        name='pose-duration'
                        required
                        styles={{ flex: 1, marginLeft: 'auto' }}
                      />
                    </div>}
                  </div>
                }/>
              ))}
            </SortableContainer>
            <Button onClick={this.handleAddPose} color="secondary">
              Add Pose
            </Button>
            <div className="container" style={{ display: 'flex' }}>
              <Button name="save_pose" variant="contained" color="primary" type="submit">
                Submit
              </Button>
            </div>
          </form>
        }
      </div>
    )
  }
}

export default SequenceForm
