import SsbTable from '../Table'

const header = [
  ['name', 'Name'],
  ['creation_time', 'Date Created'],
]

class SequenceTable extends SsbTable {
  static defaultProps = {
    dataEndpoint: '/sequences/list_view/',
    deleteEndpoint: '/sequences/delete/sequence/',
    header: header,
    navRoute: '/sequences/sequence/',
    orderBy: 0,
    title: 'Sequences',
  }
}

export default SequenceTable
