import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
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
  onCloseLoginModal: () => void;
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

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm');

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={true}
      TransitionComponent={Transition}
      onClose={props.onCloseLoginModal}
      aria-labelledby="max-width-dialog-title"
    >
      <DialogTitle id="simple-dialog-title" className={classes.dialogTitle}>
        Find your community!
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Login with Discord and come find your ideal reading community - or
          start your own! If you don't yet have a Discord account, you'll be
          prompted to create one.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <DiscordAuthButton />
        <Button onClick={props.onCloseLoginModal} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
