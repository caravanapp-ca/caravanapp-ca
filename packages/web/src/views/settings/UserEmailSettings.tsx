import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  Typography,
} from '@material-ui/core';
import { EmailSettings } from '@caravan/buddy-reading-types';
import { EMAIL_SETTINGS_KEYS_DESCRIPTIONS } from '../../common/globalConstants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
  })
);

interface UserEmailSettingsProps {
  value?: EmailSettings;
  onChange: (newVal: EmailSettings) => void;
}

export default function UserEmailSettings(props: UserEmailSettingsProps) {
  const { value, onChange } = props;
  const classes = useStyles();

  const handleChange = (key: string, newSet: boolean) => {
    if (value) {
      const newVal = { ...value, [key]: newSet };
      onChange(newVal);
    }
  };

  const addPropertyToSettings = (key: string) => {
    handleChange(key, true);
  };

  const changeAll = (newSet: boolean) => {
    const newVal: any = {};
    for (const key in EMAIL_SETTINGS_KEYS_DESCRIPTIONS) {
      if (EMAIL_SETTINGS_KEYS_DESCRIPTIONS.hasOwnProperty(key)) {
        newVal[key] = newSet;
      }
    }
    const newValTyped = newVal as EmailSettings;
    onChange(newValTyped);
  };

  let numChecked = 0;
  let numKeys = 0;

  const formControls: JSX.Element[] = [];
  for (const key in EMAIL_SETTINGS_KEYS_DESCRIPTIONS) {
    if (EMAIL_SETTINGS_KEYS_DESCRIPTIONS.hasOwnProperty(key)) {
      const description: string = EMAIL_SETTINGS_KEYS_DESCRIPTIONS[key];
      let checked = true;
      numKeys += 1;
      if (value && value.hasOwnProperty(key)) {
        checked = value[key];
      } else if (value && !value.hasOwnProperty(key)) {
        addPropertyToSettings(key);
      }
      if (checked) {
        numChecked += 1;
      }
      formControls.push(
        <FormControlLabel
          control={
            <Checkbox
              checked={checked}
              onChange={() => handleChange(key, !checked)}
              value={key}
              color="primary"
            />
          }
          label={description}
        />
      );
    }
  }

  return (
    <div className={classes.root}>
      <FormControl component="fieldset">
        <FormLabel component="legend">
          I would like to receive emails that
        </FormLabel>
        <FormGroup>{formControls}</FormGroup>
      </FormControl>
      <div className={classes.buttonsContainer}>
        <Button
          onClick={() => changeAll(false)}
          disabled={numChecked === 0}
          color="primary"
          className={classes.button}
        >
          <Typography variant="button">CLEAR ALL</Typography>
        </Button>
        <Button
          onClick={() => changeAll(true)}
          disabled={numChecked === numKeys}
          color="primary"
          className={classes.button}
        >
          <Typography variant="button">SELECT ALL</Typography>
        </Button>
      </div>
    </div>
  );
}
