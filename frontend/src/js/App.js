import {MDCDrawer} from '@material/drawer'
import {MDCTopAppBar} from '@material/top-app-bar'

import '../css/App.scss'
import './PoseTable'

const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'))
drawer.open = true

const listEl = document.querySelector('.mdc-drawer .mdc-list')
const mainContentEl = document.body.querySelector('.mdc-drawer-app-content')

listEl.addEventListener('click', (event) => {
  mainContentEl.querySelector('input, button').focus()
})

const topAppBar = new MDCTopAppBar(document.getElementById('app-bar'))
topAppBar.listen('MDCTopAppBar:nav', function () {
  drawer.open = !drawer.open
})

mainContentEl.addEventListener('click', () => {
  drawer.open = false
})
