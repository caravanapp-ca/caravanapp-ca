import clsx from 'clsx';
import React, { SyntheticEvent } from 'react';

import {
  colors,
  IconButton,
  makeStyles,
  SnackbarContent,
  Theme,
} from '@material-ui/core';
import {
  CheckCircle as CheckCircleIcon,
  Close,
  Error as ErrorIcon,
  Info,
  Warning,
} from '@material-ui/icons';

export const variantIcon = {
  success: CheckCircleIcon,
  warning: Warning,
  error: ErrorIcon,
  info: Info,
};
interface MySnackBarContentWrapperProps {
  variant: keyof typeof variantIcon;
  handleClose: (event?: SyntheticEvent, reason?: string) => void;
  message?: string;
}

const useStyles1 = makeStyles((theme: Theme) => ({
  success: {
    backgroundColor: colors.green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.main,
  },
  warning: {
    backgroundColor: colors.amber[700],
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
}));

export default function MySnackbarContentWrapper(
  props: MySnackBarContentWrapperProps
) {
  const classes = useStyles1();
  const { variant, handleClose, message, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classes[variant]}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={clsx(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          onClick={handleClose}
        >
          <Close className={classes.icon} />
        </IconButton>,
      ]}
      {...other}
    />
  );
}
