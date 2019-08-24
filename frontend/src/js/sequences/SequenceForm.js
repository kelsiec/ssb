import React from 'react'

import Button from '@material-ui/core/Button'
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

class NewSequenceForm extends React.Component {
  constructor (props) {
    super(props)

    this.cookies = new Cookies()

    this.state = {
      messages: [],
      poses: [{ value: '', label: '' }],
    }
  }

  static loadPoseOptions () {
    return fetch('/poses/poses/')
      .then(response => response.json())
      .then(json => {
        return {options: json.map((entry) => {
          return {'value': entry['id'], 'label': entry['english_name']}
        })}
      })
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
    }.bind(this))
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    this.setState(({poses}) => ({
      poses: arrayMove(poses, oldIndex, newIndex),
    }))
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
        <h3>Submit a New Sequence</h3>
        <form id='sequence-form' onSubmit={this.handleSubmit}>
          <input type='hidden' name='csrfmiddlewaretoken' value={this.cookies.get('csrftoken')} />
          <div className="container" style={{display: 'flex', width: '50%', marginBottom: 20}}>
            <TextField
              fullWidth={true}
              label="Sequence Name"
              id='sequence-name'
              name='sequence-name'
              required
            />
          </div>
          <SortableContainer onSortEnd={this.onSortEnd} useDragHandle>
            { this.state.poses.map((pose, index) => (
              <SortableItem key={'pose-li-' + index} index={index} value={
                <div style={{display: 'flex', width: '100%'}}>
                  <Select.Async
                    key={'pose-' + index}
                    name="poses"
                    placeholder="Poses"
                    loadOptions={NewSequenceForm.loadPoseOptions}
                    onChange={(event) => this.handlePoseChange(event, index)}
                    value={this.state.poses[index]}
                  />
                  <DeleteIcon onClick={() => this.handlePoseRemove(index)}/>
                </div>

              } />
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
      </div>
    )
  }
}

export default NewSequenceForm
