import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  TextField,
  IconButton,
  Popover,
  Typography,
  Container,
} from '@material-ui/core';
import { HelpOutline } from '@material-ui/icons';
import { MAX_EMAIL_LENGTH } from '../common/globalConstants';
import { validEmail } from '../common/validEmail';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    disabled: {
      color: theme.palette.text.primary,
      borderColor: theme.palette.primary.main,
    },
    notchedOutline: {
      disabled: {
        borderColor: theme.palette.grey[400] + ' !important',
      },
    },
    disabledLabel: {
      color: theme.palette.primary.main + ' !important',
    },
    helpButton: {
      margin: theme.spacing(1),
      // This compensates for the height of the helper text on the text field.
      marginBottom: theme.spacing(1) + 12,
    },
    popover: {
      pointerEvents: 'none',
    },
    paper: {
      padding: theme.spacing(1),
    },
    popoverContainer: {
      padding: 0,
    },
  })
);

interface UserEmailFieldProps {
  editable?: boolean;
  onChange: (newVal: string, valid: boolean) => void;
  value?: string;
}

const validateEmail = (email?: string) => {
  if (!email || email.length === 0) {
    return true;
  } else {
    return validEmail(email);
  }
};

export default function UserEmailField(props: UserEmailFieldProps) {
  const { editable, onChange, value } = props;
  const [focused, setFocused] = useState(false);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [error, setError] = useState<[boolean, string]>([false, '']);
  const classes = useStyles();

  const handleHelpMouseEnter = (
    event: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    setAnchorEl(event.currentTarget);
  };

  const handleHelpMouseLeave = () => {
    setAnchorEl(null);
  };

  const handleHelpClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (anchorEl) {
      setAnchorEl(null);
    } else {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleFocus = () => {
    setFocused(true);
  };

  const handleBlur = () => {
    setFocused(false);
    if (validateEmail(value)) {
      setError([false, '']);
    } else {
      setError([true, 'Please enter a valid email address!']);
    }
  };

  const open = Boolean(anchorEl);

  return (
    <div className={classes.root}>
      <TextField
        onChange={e => onChange(e.target.value, validateEmail(e.target.value))}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={editable ? !editable : false}
        InputProps={{
          classes: {
            root: classes.root,
            disabled: classes.disabled,
            notchedOutline: classes.notchedOutline,
          },
          inputProps: { MAX_EMAIL_LENGTH },
        }}
        InputLabelProps={{
          classes: {
            disabled: classes.disabledLabel,
          },
        }}
        id="user-email"
        label="Your Email"
        value={value}
        error={error[0]}
        helperText={
          error[0]
            ? error[1]
            : focused
            ? value
              ? `${MAX_EMAIL_LENGTH - value.length} chars remaining`
              : `${MAX_EMAIL_LENGTH} chars remaining`
            : ' '
        }
        margin="normal"
        variant="outlined"
        fullWidth
      />
      <IconButton
        className={classes.helpButton}
        aria-label="help"
        onMouseEnter={handleHelpMouseEnter}
        onMouseLeave={handleHelpMouseLeave}
        onClick={handleHelpClick}
      >
        <HelpOutline />
      </IconButton>
      <Popover
        id="email-mouse-over-popover"
        className={classes.popover}
        classes={{
          paper: classes.paper,
        }}
        open={open}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        onClose={handleHelpMouseLeave}
        disableRestoreFocus
      >
        <Container className={classes.popoverContainer} maxWidth="xs">
          <Typography variant="body2" gutterBottom>
            Caravan will use your email to:
          </Typography>
          <Typography variant="body2">
            • Send reminders of upcoming discussions
          </Typography>
          <Typography variant="body2">• Recommend clubs and users</Typography>
          <Typography variant="body2" gutterBottom>
            • Keep you posted on Caravan updates
          </Typography>
          <Typography variant="body2">
            You can disable any of these emails in your personal settings. We
            will not share it with anyone.
          </Typography>
        </Container>
      </Popover>
    </div>
  );
}
