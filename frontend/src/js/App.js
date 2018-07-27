import React from 'react'
import ReactDOM from 'react-dom'
import TopNav from './TopNav'
import './PoseTable'

const topnav = document.getElementById('topnav')
if (topnav) ReactDOM.render(<TopNav />, topnav)
