import React from 'react';
import { TextField, makeStyles, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

interface QuestionAnswerProps {
  questionKey: string;
  question: string;
  answer: string;
  numRows?: number;
  isEditing: boolean;
  onEdit?: (
    questionKey: string,
    newAnswer: string,
    visible: boolean,
    sort: number
  ) => void;
}

const useStyles = makeStyles(theme => ({
  root: {},
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
}));

export default function QuestionAnswer(props: QuestionAnswerProps) {
  const { questionKey, question, answer, numRows, isEditing, onEdit } = props;
  const classes = useStyles();
  return (
    <TextField
      onChange={
        onEdit && isEditing
          ? // TODO: Add support for visible, and sort here (params 3-4)
            e => onEdit(questionKey, e.target.value, true, 0)
          : undefined
      }
      disabled={!(onEdit && isEditing)}
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
      id={questionKey}
      label={question}
      defaultValue={answer}
      rows={numRows || 4}
      fullWidth
      multiline
      margin="normal"
      variant="outlined"
    />
  );
}
