import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import DiscordAuthButton from './DiscordAuthButton';

const Transition = React.forwardRef<unknown, TransitionProps>(
  function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  }
);

interface LoginModalProps {
  onCloseLoginDialog: () => void;
}

const useStyles = makeStyles(theme => ({
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
    fontWeight: 'bold',
    fontSize: '50px',
  },
}));

export default function DiscordLoginModal(props: LoginModalProps) {
  const classes = useStyles();
  const { onCloseLoginDialog } = props;

  return (
    <Dialog open={true} onClose={onCloseLoginDialog}>
      <DialogTitle id="alert-dialog-title">
        {'Log in to Caravan via Discord?'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          This will allow you to join and create clubs. If it is your first
          time, it will also add you to the Caravan Clubs Discord server where
          all clubs are currently hosted. If you don't have Discord yet you can
          sign up by following the link below.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseLoginDialog} color="primary">
          Close
        </Button>
        <DiscordAuthButton />
      </DialogActions>
    </Dialog>
  );
}
