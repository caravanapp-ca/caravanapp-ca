import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  FormControlLabel,
  Checkbox,
  FormControl,
  FormLabel,
  FormGroup,
  Button,
  Typography,
} from '@material-ui/core';
import { SameKeysAs } from '@caravan/buddy-reading-types';

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

interface CheckboxSettingsEditorProps<T> {
  label: string;
  onChange: (newVal: T) => void;
  options: SameKeysAs<T>;
  showSelectAllButtons?: boolean;
  value: T;
}

export default function CheckboxSettingsEditor<T>(
  props: CheckboxSettingsEditorProps<T>
) {
  const { label, onChange, options, showSelectAllButtons, value } = props;
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
    for (const key in options) {
      if (options.hasOwnProperty(key)) {
        newVal[key] = newSet;
      }
    }
    const newValTyped = newVal as T;
    onChange(newValTyped);
  };

  let numChecked = 0;
  let numKeys = 0;
  const valueAny = value as any;
  const formControls: JSX.Element[] = [];
  for (const key in options) {
    if (options.hasOwnProperty(key)) {
      const description: string = options[key];
      let checked = true;
      numKeys += 1;
      if (valueAny && valueAny.hasOwnProperty(key)) {
        checked = valueAny[key];
      } else if (valueAny && !valueAny.hasOwnProperty(key)) {
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
          key={key}
        />
      );
    }
  }

  return (
    <div className={classes.root}>
      <FormControl component="fieldset">
        <FormLabel component="legend">{label}</FormLabel>
        <FormGroup>{formControls}</FormGroup>
      </FormControl>
      {showSelectAllButtons && (
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
      )}
    </div>
  );
}
