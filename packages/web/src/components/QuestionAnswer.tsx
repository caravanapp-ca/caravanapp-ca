import React from 'react';
import { TextField, makeStyles, withStyles } from '@material-ui/core';

interface QuestionAnswerProps {
  key: string;
  question: string;
  answer: string;
  numRows?: number;
  editing?: boolean;
  onEdit?: (newAnswer: string) => void;
}

const useStyles = makeStyles(theme => ({
  root: {},
  disabled: {
    color: theme.palette.text.primary,
    borderColor: theme.palette.primary.main,
  },
  notchedOutline: {
    borderColor: theme.palette.primary.main + ' !important',
  },
  disabledLabel: {},
}));

export default function QuestionAnswer(props: QuestionAnswerProps) {
  const { key, question, answer, numRows, editing, onEdit } = props;
  const classes = useStyles();
  return (
    <TextField
      InputProps={{
        classes: {
          root: classes.root,
          disabled: classes.disabled,
          notchedOutline: classes.notchedOutline,
        },
      }}
      InputLabelProps={{
        classes: {
          disabled: classes.disabledLabel,
        },
      }}
      id={key}
      label={question}
      defaultValue={answer}
      rows={numRows || 4}
      fullWidth
      multiline
      disabled
      margin="normal"
      variant="outlined"
    />
  );
}
