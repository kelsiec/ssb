import React from 'react'
import ReactDOM from 'react-dom'
import DataProvider from './DataProvider'
import SsbTable from './Table'

const header = [
  ['english_name', 'English Name'],
  ['sanskrit_name', 'Sanskrit Name'],
  ['breath', 'Breath'],
  ['position_classification', 'Body Position'],
  ['spinal_classification', 'Spinal Position'],
  ['challenge_level', 'Challenge Level'],
  ['benefits', 'Benefits'],
]
const PoseTable = () => (
  <DataProvider
    endpoint='/poses/poses/'
    render={data => <SsbTable title='Poses' header={header} data={data} orderBy={0} deleteAPI='/poses/delete_pose/' />}
  />
)

const wrapper = document.getElementById('pose-table-container')
if (wrapper) ReactDOM.render(<PoseTable />, wrapper)
