import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'

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

import VariantSnackbar from '../VariantSnackbar'

const Drag = sortableHandle(() => <DragHandle/>)

const SortableItem = sortableElement(({value}) => (
  <div className="container" style={{
    width: '50%',
    padding: 20,
    marginBottom: 20,
    borderStyle: 'solid',
    borderSpacing: 20,
    borderRadius: 10,
  }}>
    <Drag/>
    {value}
  </div>
))

const SortableContainer = sortableContainer(({children}) => {
  return <div>{children}</div>
})

class SequenceForm extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  };

  constructor (props) {
    super(props)

    this.cookies = new Cookies()

    this.sequenceId = this.props.match.params.id ? this.props.match.params.id : ''
    this.poseLibrary = []
    this.breathDirections = ['Inhale', 'Exhale', 'Either']

    this.state = {
      loadingSequence: this.sequenceId !== '',
      loadingPoses: true,
      messages: [],
      name: '',
      poses: [],
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
          name: json['name'],
          loadingSequence: false,
          poses: json['poses'],
        })
      })
  }

  loadPoses () {
    fetch('/poses/poses/')
      .then(response => response.json())
      .then(json => {
        this.poseLibrary = json.reduce(function (map, obj) {
          map[obj['id']] = obj
          return map
        }, {})
        this.setState({
          loadingPoses: false,
        })
      })
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value})
  }

  handleAddPose = () => {
    this.setState({
      poses: this.state.poses.concat({}),
    })
  }

  handlePoseChange = (event, index) => {
    this.setState({
      poses: this.state.poses.map((item, mIndex) => {
        if (index !== mIndex) return item
        return {
          'id': event['value'],
          'breath_direction': this.poseLibrary[event['value']]['breath'],
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
          let updatedItem = item
          updatedItem['breath_direction'] = event['value']
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
      this.setState({messages: data['messages']})
      this.props.history.push('/sequences/sequence/' + data['instance_id'])
    }.bind(this))
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({poses}) => ({
      poses: arrayMove(poses, oldIndex, newIndex),
    }))
  }

  getPoseData (index, item) {
    if (this.state.poses[index] != null &&
      this.poseLibrary[this.state.poses[index]['id']] != null) {
      return this.poseLibrary[this.state.poses[index]['id']][item]
    } else {
      return ''
    }
  }

  render () {
    return (
      <div className="container" key={'container'}>
        <div id="messages">
          {this.state.messages.map((message, index) =>
            <VariantSnackbar
              key={'message-' + index}
              message={<span>{message['message']}</span>}
              variant={message['variant']}
            />
          )}
        </div>
        <div
          style={{cursor: 'pointer', verticalAlign: 'middle'}}
          onClick={_ => this.props.history.push('/sequences/')} >
          <ArrowBackIosIcon /> Back to All Sequences
        </div>
        <h3>Submit a New Sequence</h3>
        {this.isLoading() ? <CircularProgress/> :
          <form id='sequence-form' onSubmit={this.handleSubmit}>
            <input type='hidden' name='csrfmiddlewaretoken' value={this.cookies.get('csrftoken')}/>
            <input type='hidden' name='sequence-id' value={this.sequenceId} />
            <div className="container" style={{display: 'flex', width: '50%', marginBottom: 20}}>
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
                <SortableItem style={{width: '100%'}} key={'pose-li-' + index} index={index} value={
                  <div>
                    <div style={{display: 'flex', width: '100%', marginBottom: 5}}>
                      <Select
                        key={'pose-' + index}
                        name="poses"
                        placeholder="Poses"
                        options={
                          Object.entries(this.poseLibrary).map(([key, value]) => {
                            return {'value': key, 'label': value['english_name']}
                          })
                        }
                        onChange={(event) => this.handlePoseChange(event, index)}
                        value={{
                          'value': this.state.poses[index] != null ? this.state.poses[index]['id'] : '',
                          'label': this.getPoseData(index, 'english_name'),
                        }}
                        styles={{ container: base => ({...base, flex: 1}) }}
                      />
                      <DeleteIcon onClick={() => this.handlePoseRemove(index)}/>
                    </div>
                    {this.state.poses[index] !== {} &&
                      <div style={{width: '33%'}}>
                        <Select
                          key={'pose-breath-direction-' + index}
                          name="pose-breath-direction"
                          placeholder="Breath Direction"
                          styles={{
                            container: base => ({ ...base, flex: 1 }),
                            control: base => ({
                              ...base,
                              backgroundColor: this.state.poses[index].breath_direction === 2 ? '#F1948A' : '#FFFFFF',
                            }),
                          }}
                          options={
                            this.breathDirections.filter((value, _) => value !== 'Either').map((value, index) => {
                              return { 'value': index, 'label': value }
                            })
                          }
                          onChange={(event) => this.handleBreathChange(event, index)}
                          value={{
                            'value': this.state.poses[index] != null ? this.state.poses[index]['breath_direction'] : '',
                            'label': this.state.poses[index] != null ?
                              this.breathDirections[this.state.poses[index]['breath_direction']] : '',
                          }}
                        />
                      </div>
                    }
                  </div>
                }/>
              ))}
            </SortableContainer>
            <Button onClick={this.handleAddPose} color="secondary">
              Add Pose
            </Button>
            <div className="container" style={{display: 'flex'}}>
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
