import React from 'react'

import classNames from 'classnames'
import Cookies from 'universal-cookie'
import PropTypes from 'prop-types'

import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import IconButton from '@material-ui/core/IconButton'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'

import { lighten } from '@material-ui/core/styles/colorManipulator'
import { withStyles } from '@material-ui/core/styles'

import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
  theme.palette.type === 'light'
    ? {
      color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    }
    : {
      color: theme.palette.text.primary,
      backgroundColor: theme.palette.secondary.dark,
    },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
})

let SsbTableToolbar = props => {
  const { title, numSelected, onFilterChange, deleteSelected } = props

  return (
    <Toolbar
      className={classNames(toolbarStyles.root, {
        [toolbarStyles.highlight]: numSelected > 0,
      })}
    >
      <div className={toolbarStyles.title}>
        {numSelected > 0 ? (
          <Typography color='inherit' variant='subheading'>
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant='title' id='tableTitle'>
            {title}
          </Typography>
        )}
      </div>
      <div className={toolbarStyles.spacer} />
      <div className={toolbarStyles.actions}>
        {numSelected > 0 ? (
          deleteSelected !== undefined ? (
            <Tooltip title='Delete'>
              <IconButton aria-label='Delete' onClick={() => { deleteSelected() }}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          ) : ('')
        ) : (
          <Tooltip title='Filter list'>
            <IconButton aria-label='Filter list'>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
        <input type='text' onChange={e => onFilterChange(e)}/>
      </div>
    </Toolbar>
  )
}

SsbTableToolbar.propTypes = {
  deleteSelected: PropTypes.func,
  numSelected: PropTypes.number.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
}

SsbTableToolbar = withStyles(toolbarStyles)(SsbTableToolbar)

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
})

class SsbTable extends React.Component {
  static defaultProps = {
    order: 'asc',
    selected: [],
    page: 0,
    rowsPerPage: 5,
    title: '',
  }
  static propTypes = {
    classes: PropTypes.object.isRequired,
    dataEndpoint: PropTypes.string.isRequired,
    deleteEndpoint: PropTypes.string,
    header: PropTypes.array.isRequired,
    history: PropTypes.object.isRequired,
    order: PropTypes.string,
    orderBy: PropTypes.number.isRequired,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array,
    navRoute: PropTypes.string,
    title: PropTypes.string,
  }

  constructor (props) {
    super(props)

    this.cookies = new Cookies()

    this.state = {
      data: [],
      filterBy: '',
      loaded: false,
      order: props.order,
      orderBy: props.orderBy,
      selected: props.selected,
      rowsPerPage: props.rowsPerPage,
      page: props.page,
    }
  }

  componentDidMount () {
    fetch(this.props.dataEndpoint)
      .then(response => {
        if (response.status !== 200) {
          return this.setState({ placeholder: 'Something went wrong' })
        }
        return response.json()
      })
      .then(data => this.setState({ data: data, loaded: true }))
  }

  getSorting = (order, orderByIndex) => {
    let orderBy = this.props.header[orderByIndex][0]
    return function (a, b) {
      let result = 0
      if (a[orderBy] < b[orderBy]) result = -1
      if (a[orderBy] > b[orderBy]) result = 1

      if (order === 'desc') result *= -1

      return result
    }
  }

  createSortHandler = property => event => {
    this.handleRequestSort(event, property)
  }

  deleteSelected = () => {
    let formData = new FormData()
    for (let i = 0; i < this.state.selected.length; i++) {
      formData.append('pose_ids', this.getFilteredData()[this.state.selected[i]]['id'])
    }

    fetch(this.props.deleteEndpoint, {
      credentials: 'include',
      method: 'POST',
      headers: {
        'X-CSRFToken': this.cookies.get('csrftoken'),
      },
      body: formData,
    })
  }

  getFilteredData = () => {
    return this.state.data
      .filter(e => { return SsbTable.isMatch(e, this.state.filterBy) })
      .sort(this.getSorting(this.state.order, this.state.orderBy))
      .slice(
        this.state.page * this.state.rowsPerPage,
        Math.min(this.state.data.length, (this.state.page + 1) * this.state.rowsPerPage)
      )
  }

  handleGoClick = (event, id) => {
    this.props.history.push(this.props.navRoute + id)
  }

  handleRequestFilter = event => {
    this.setState({ filterBy: event.target.value })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'asc'

    if (this.state.orderBy === property && this.state.order === 'asc') {
      order = 'desc'
    }

    this.setState({ order, orderBy })
  }

  handleSelectAllClick = (event, checked) => {
    if (checked) {
      this.setState({ selected: this.state.data.map((n, index) => index) })
    } else {
      this.setState({selected: []})
    }
  }

  handleSelectRow = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    this.setState({ selected: newSelected })
  }

  handleChangePage = (event, page) => {
    this.setState({ page })
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value })
  }

  isSelected = id => {
    return this.state.selected.indexOf(id) !== -1
  }

  static isMatch = (object, toMatch) => {
    toMatch = toMatch.toLowerCase()
    let isMatch = false
    if (toMatch) {
      Object.keys(object).filter((key) => key !== 'id').forEach((key) => {
        let value = object[key]
        if (value.constructor === Array) {
          Object.values(value).forEach(subValue => {
            if (subValue.toLowerCase().includes(toMatch)) {
              isMatch = true
            }
          })
        } else if (value.toLowerCase().includes(toMatch)) {
          isMatch = true
        }
      })
      return isMatch
    }
    return true
  }

  static printCell (rowIndex, columnIndex, cell) {
    let cellKey = rowIndex + '-' + columnIndex
    if (cell === undefined) {
      return <TableCell key={cellKey} />
    } else if (cell.constructor === Array) {
      return <TableCell key={cellKey}>
        {cell.map((entry, index) => <li key={rowIndex + '-' + index}>{entry}</li>)}
      </TableCell>
    } else {
      return <TableCell key={cellKey}>{cell}</TableCell>
    }
  }

  render () {
    const classes = this.props.classes
    const title = this.props.title
    const header = this.props.header
    const { data, order, orderBy, selected, rowsPerPage, page } = this.state
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    const numSelected = selected.length
    const rowCount = data.length

    return (
      <Paper className={classes.root}>
        <SsbTableToolbar
          title={title}
          numSelected={selected.length}
          onFilterChange={this.handleRequestFilter}
          deleteSelected={this.props.deleteEndpoint ? this.deleteSelected : undefined }
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell padding='checkbox'>
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={numSelected === rowCount}
                    onChange={this.handleSelectAllClick}
                  />
                </TableCell>
                {header.map((value, index) => {
                  return <TableCell key={value[0]} sortDirection={orderBy === index ? order : false}>
                    <Tooltip title='Sort' placement={'bottom-start'} enterDelay={300} >
                      <TableSortLabel
                        active={orderBy === index}
                        direction={order}
                        onClick={this.createSortHandler(index)}
                      >
                        {value[1]}
                      </TableSortLabel>
                    </Tooltip>
                  </TableCell>
                })}
                {this.props.navRoute !== undefined && <TableCell /> }
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.loading ? <CircularProgress/> : [
                this.getFilteredData().map((row, index) => {
                  const isSelected = this.isSelected(index)
                  return (
                    <TableRow
                      hover
                      role='checkbox'
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isSelected}
                    >
                      <TableCell onClick={event => this.handleSelectRow(event, index)} padding='checkbox'>
                        <Checkbox checked={isSelected}/>
                      </TableCell>
                      {header.map((value, colIndex) => SsbTable.printCell(index, colIndex, row[value[0]]))}
                      {this.props.navRoute !== undefined &&
                        <TableCell>
                          <ArrowForwardIosIcon
                            style={{cursor: 'pointer'}}
                            onClick={event => this.handleGoClick(event, row['id'])}
                          />
                        </TableCell>}
                    </TableRow>
                  )
                }),
                emptyRows > 0 && (
                  <TableRow key='empties' style={{height: 49 * emptyRows}}>
                    <TableCell colSpan={header.length + 1} />
                  </TableRow>
                ),
              ]}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          component='div'
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    )
  }
}

export default withStyles(styles)(SsbTable)
