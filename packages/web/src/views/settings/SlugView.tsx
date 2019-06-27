import React, { useEffect } from 'react';
import clsx from 'clsx';
import { User } from '@caravan/buddy-reading-types';
import { createStyles, makeStyles, Theme, TextField } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import CheckCircleOutlinedIcon from '@material-ui/icons/CheckCircleOutlined';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';

export type SlugValidationState =
  | 'default'
  | 'valid'
  | 'invalid'
  | 'taken'
  | 'loading';

interface SlugViewProps {
  onUpdateSlug: (slug: string) => void;
  slug?: string;
  validationState: SlugValidationState;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    dense: {
      marginTop: theme.spacing(2),
    },
    progress: {
      margin: theme.spacing(2),
    },
  })
);

export default function SlugView(props: SlugViewProps) {
  const classes = useStyles();
  const { onUpdateSlug, slug, validationState } = props;

  const getTextFieldValidationState = (
    validationState: SlugValidationState
  ) => {
    switch (validationState) {
      case 'taken':
        return { helperText: 'Name is taken', element: <CancelOutlinedIcon /> };
      case 'invalid':
        return {
          helperText: 'Name is invalid',
          element: <CancelOutlinedIcon />,
        };
      case 'loading':
        return {
          helperText: 'Loading...',
          element: <CircularProgress className={classes.progress} />,
        };
      case 'valid':
        return { helperText: 'Valid!', element: <CheckCircleOutlinedIcon /> };
      case 'default':
        return { helperText: '', element: null };
      default:
        return { helperText: '', element: null };
    }
  };

  const [textState, setTextState] = React.useState(
    getTextFieldValidationState('default')
  );
  const { helperText, element: validationElement } = textState;

  const handleSlugChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateSlug(event.target.value);
  };

  useEffect(() => {
    const textState = getTextFieldValidationState(validationState);
    setTextState(textState);
  }, [validationState]);

  return (
    <form className={classes.container} noValidate autoComplete="off">
      <TextField
        error={validationState === 'taken' || validationState === 'invalid'}
        id="outlined-dense"
        label="Username"
        className={clsx(classes.textField, classes.dense)}
        value={slug}
        onChange={handleSlugChange}
        margin="dense"
        variant="outlined"
        helperText={helperText}
      />
      {validationElement}
    </form>
  );
}
