import React from 'react'
import ReactDOM from 'react-dom'
import DataProvider from './DataProvider'
import SsbTable from './Table'

const header = [
  'English Name',
  'Sanskrit Name',
  'Breath',
  'Body Position',
  'Spinal Position',
  'Challenge Level',
  'Benefits',
]
const PoseTable = () => (
  <DataProvider
    endpoint='/poses/poses/'
    render={data => <SsbTable header={header} data={data} orderBy='english_name' />}
  />
)

const wrapper = document.getElementById('pose-table-container')
if (wrapper) ReactDOM.render(<PoseTable />, wrapper)
