import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { connect } from 'react-redux'

import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import ErrorIcon from '@material-ui/icons/Error'
import InfoIcon from '@material-ui/icons/Info'
import CloseIcon from '@material-ui/icons/Close'
import green from '@material-ui/core/colors/green'
import amber from '@material-ui/core/colors/amber'
import IconButton from '@material-ui/core/IconButton'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import WarningIcon from '@material-ui/icons/Warning'
import { withStyles } from '@material-ui/core/styles'

import { removeMessage } from '../redux/actions/messagesActions'

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
}

const styles = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing(1),
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
})

function VariantSnackbar (props) {
  const { classes, className, message, uid, variant } = props
  const Icon = variantIcon[variant]

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          className={classes.close}
          onClick={() => props.dispatch(removeMessage(uid))}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
    />
  )
}

VariantSnackbar.propTypes = {
  classes: PropTypes.object.isRequired,
  className: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.node,
  uid: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
}

export default connect(state => ({ ...state }))(withStyles(styles)(VariantSnackbar))
