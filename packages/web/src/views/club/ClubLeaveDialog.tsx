import React from 'react';
import {
  makeStyles,
  useTheme,
  Theme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
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
    fontWeight: 'bold',
    fontSize: '50px',
  },
}));

export default function ClubLeaveDialog(props: LoginModalProps) {
  const classes = useStyles();
  const theme = useTheme();

  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState<DialogProps['maxWidth']>('sm');

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={true}
      TransitionComponent={Transition}
      onClose={props.onCancel}
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
        <Button
          className={classes.button}
          onClick={props.onCancel}
          color="primary"
        >
          Cancel
        </Button>
        <MuiThemeProvider theme={errorTheme}>
          <Button
            className={classes.button}
            onClick={props.onConfirm}
            color="primary"
          >
            Yes, leave the club
          </Button>
        </MuiThemeProvider>
      </DialogActions>
    </Dialog>
  );
}
