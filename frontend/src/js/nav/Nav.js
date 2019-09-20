import React from 'react'

import { NavLink } from 'react-router-dom'

import PropTypes from 'prop-types'

import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItemText from '@material-ui/core/ListItemText'

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import MenuIcon from '@material-ui/icons/Menu'

import { openNav, closeNav } from '../redux/actions/navActions'

class Nav extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    match: PropTypes.object.isRequired,
    navReducer: PropTypes.object.isRequired,
  }

  handleDrawerClose () {
    this.props.dispatch(closeNav())
  }

  render () {
    return (
      <div>
        <Drawer anchor="left" open={this.props.navReducer.navDrawerOpen}>
          <div align="right">
            <IconButton onClick={() => this.handleDrawerClose()}><ChevronLeftIcon /></IconButton>
          </div>
          <Divider />
          <List>
            <NavLink to="/poses/view_poses" className='mdc-list-item'>
              <ListItemText>Pose Library</ListItemText>
            </NavLink>
            <NavLink to="/poses/create_pose" className='mdc-list-item'>
              <ListItemText primary="Submit a Pose" />
            </NavLink>
            <NavLink to="/sequences/" className='mdc-list-item'>
              <ListItemText primary="Sequences" />
            </NavLink>
          </List>
        </Drawer>
        <IconButton
          color="primary"
          aria-label="open drawer"
          onClick={() => this.props.dispatch(openNav())}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
      </div>
    )
  }
}

export default Nav
