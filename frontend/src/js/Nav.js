import React from 'react'

import { NavLink } from 'react-router-dom'

import { MDCDrawer } from '@material/drawer/index'
import { MDCTopAppBar } from '@material/top-app-bar/index'
import MenuIcon from '@material-ui/icons/Menu'

class Nav extends React.Component {
  componentDidMount () {
    let drawer = MDCDrawer.attachTo(document.getElementById('drawer'))

    const topAppBar = new MDCTopAppBar(document.getElementById('app-bar'))
    topAppBar.listen('MDCTopAppBar:nav', function () {
      drawer.open = !drawer.open
    })

    document.body.querySelector('.mdc-drawer-app-content').addEventListener('click', () => {
      drawer.open = false
    })
  }

  render () {
    return (
      <div className="container">
        <div id='drawer' className="mdc-drawer mdc-drawer--dismissible">
          <div className="mdc-drawer__content">
            <nav className="mdc-list">
              <NavLink to="/poses/view_poses" className="mdc-list-item">
                <span className="mdc-list-item__text">Pose Library</span>
              </NavLink>
              <NavLink to="/poses/create_pose" className="mdc-list-item">
                <span className="mdc-list-item__text">Submit a Pose</span>
              </NavLink>
              <NavLink to="/sequences/" className="mdc-list-item">
                <span className="mdc-list-item__text">Sequences</span>
              </NavLink>
            </nav>
          </div>
        </div>
        <div className="mdc-drawer-app-content">
          <header className="mdc-top-app-bar app-bar" id="app-bar">
            <div className="mdc-top-app-bar__row">
              <section className="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
                <a href="#" className="demo-menu material-icons mdc-top-app-bar__navigation-icon">
                  <i className="material-icons"><MenuIcon /></i>
                </a>
              </section>
            </div>
          </header>
        </div>
      </div>
    )
  }
}

export default Nav
