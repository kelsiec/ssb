import SsbTable from '../Table'

const header = [
  ['english_name', 'English Name'],
  ['sanskrit_name', 'Sanskrit Name'],
  ['breath', 'Breath'],
  ['position_classification', 'Body Position'],
  ['spinal_classification', 'Spinal Position'],
  ['challenge_level', 'Challenge Level'],
  ['benefits', 'Benefits'],
]

class PoseTable extends SsbTable {
  static defaultProps = {
    dataEndpoint: '/poses/poses/',
    deleteEndpoint: '/poses/delete_pose/',
    header: header,
    orderBy: 0,
    title: 'Poses',
  }
}

export default PoseTable
