import React from 'react'

import PropTypes from 'prop-types'

import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import TextField from '@material-ui/core/TextField'

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
    display: 'flex',
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

    this.state = {
      loading: this.sequenceId !== '',
      messages: [],
      name: '',
      poses: [{ value: '', label: '' }],
    }
  }

  componentDidMount () {
    if (this.sequenceId !== '') {
      this.loadSequence(this.sequenceId)
    }
  }

  loadSequence (sequenceId) {
    fetch('/sequences/sequence/' + sequenceId + '/')
      .then(response => response.json())
      .then(json => {
        this.setState({
          name: json['name'],
          loading: false,
          poses: json['poses'],
        })
      })
  }

  static loadPoseOptions () {
    return fetch('/poses/poses/')
      .then(response => response.json())
      .then(json => {
        return {
          options: json.map((entry) => {
            return {'value': entry['id'], 'label': entry['english_name']}
          }),
        }
      })
  }

  handleNameChange = (event) => {
    this.setState({name: event.target.value})
  }

  handleAddPose = () => {
    this.setState({
      poses: this.state.poses.concat([{ id: '', english_name: '' }]),
    })
  }

  handlePoseChange = (event, index) => {
    this.setState({
      poses: this.state.poses.map((item, mIndex) => {
        if (index !== mIndex) return item
        return event
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
        <h3>Submit a New Sequence</h3>
        {this.state.loading ? <CircularProgress/> :
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
                <SortableItem key={'pose-li-' + index} index={index} value={
                  <div style={{display: 'flex', width: '100%'}}>
                    <Select.Async
                      key={'pose-' + index}
                      name="poses"
                      placeholder="Poses"
                      loadOptions={SequenceForm.loadPoseOptions}
                      onChange={(event) => this.handlePoseChange(event, index)}
                      value={this.state.poses[index]}
                    />
                    <DeleteIcon onClick={() => this.handlePoseRemove(index)}/>
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
