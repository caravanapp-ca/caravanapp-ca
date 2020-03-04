import React from 'react';

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogProps,
  DialogTitle,
  makeStyles,
  MuiThemeProvider,
  Slide,
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';

import { errorTheme } from '../../theme';

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

interface LoginModalProps {
  onConfirm: () => void;
  onCancel: () => void;
  open: boolean;
}

const useStyles = makeStyles(theme => ({
  button: {
    margin: theme.spacing(1),
  },
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    outline: 'none',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    top: '50%',
    left: '50%',
  },
  modalStyle: {
    position: 'absolute',
    boxShadow: '#7289da',
    background: 'rgba(255, 255, 255, 1.0)',
    float: 'left',
    left: '50%',
    top: '50%',
    height: '50%',
    width: '50%',
    transform: 'translate(-50%, -50%)',
  },
  dialogTitle: {
    fontWeight: 600,
    fontSize: '50px',
  },
}));

export default function ClubLeaveDialog(props: LoginModalProps) {
  const classes = useStyles();

  const { onCancel, onConfirm, open } = props;

  const fullWidth = true;
  const maxWidth: DialogProps['maxWidth'] = 'sm';
  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      TransitionComponent={Transition}
      onClose={onCancel}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="leave-club-dialog" className={classes.dialogTitle}>
        Leave club?
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to leave the club?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button className={classes.button} onClick={onCancel} color="primary">
          Cancel
        </Button>
        <MuiThemeProvider theme={errorTheme}>
          <Button
            className={classes.button}
            onClick={onConfirm}
            color="primary"
          >
            Yes, leave the club
          </Button>
        </MuiThemeProvider>
      </DialogActions>
    </Dialog>
  );
}
