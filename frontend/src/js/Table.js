import React from 'react'

import classNames from 'classnames'
import PropTypes from 'prop-types'

import Checkbox from '@material-ui/core/Checkbox'
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
  const { title, numSelected, onFilterChange } = props

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
          <Tooltip title='Delete'>
            <IconButton aria-label='Delete'>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title='Filter list'>
            <IconButton aria-label='Filter list'>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
        <input type="text" onChange={e => onFilterChange(e)}/>
      </div>
    </Toolbar>
  )
}

SsbTableToolbar.propTypes = {
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
    data: PropTypes.array.isRequired,
    header: PropTypes.array.isRequired,
    order: PropTypes.string,
    orderBy: PropTypes.number.isRequired,
    page: PropTypes.number,
    rowsPerPage: PropTypes.number,
    selected: PropTypes.array,
    title: PropTypes.string,
  }

  constructor (props) {
    super(props)

    this.state = {
      data: props.data,
      filterBy: '',
      order: props.order,
      orderBy: props.orderBy,
      selected: props.selected,
      rowsPerPage: props.rowsPerPage,
      page: props.page,
    }
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
      this.setState(state => ({ selected: state.data.map((n, index) => index) }))
      return
    }
    this.setState({ selected: [] })
  }

  handleClick = (event, id) => {
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
    let isMatch = false
    if (toMatch) {
      Object.values(object).forEach(value => {
        if (value.constructor === Array) {
          Object.values(value).forEach(subValue => {
            if (subValue.includes(toMatch)) {
              isMatch = true
            }
          })
        }
        if (value.includes(toMatch)) {
          isMatch = true
        }
      })
      return isMatch
    }
    return true
  }

  static printCell (rowIndex, columnIndex, cell) {
    if (cell[1].constructor === Array) {
      return <TableCell key={rowIndex + '-' + columnIndex}>
        {cell[1].map((entry, index) => <li key={rowIndex + '-' + index}>{entry}</li>)}
      </TableCell>
    } else {
      return <TableCell key={rowIndex + '-' + columnIndex}>{cell[1]}</TableCell>
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
        />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby='tableTitle'>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {data
                .filter(e => { return SsbTable.isMatch(e, this.state.filterBy) })
                .sort(this.getSorting(order, orderBy))
                .slice(page * rowsPerPage, Math.min(data.length, (page + 1) * rowsPerPage))
                .map((row, index) => {
                  const isSelected = this.isSelected(index)
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, index)}
                      role='checkbox'
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isSelected}
                    >
                      <TableCell padding='checkbox'>
                        <Checkbox checked={isSelected}/>
                      </TableCell>
                      {Object.entries(row).map((cell, colIndex) => SsbTable.printCell(index, colIndex, cell))}
                    </TableRow>
                  )
                })
              }
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={header.length + 1} />
                </TableRow>
              )}
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
