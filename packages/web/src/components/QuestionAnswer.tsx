import React from 'react';
import { TextField, makeStyles, IconButton } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';

interface QuestionAnswerProps {
  questionKey: string;
  isNew: boolean;
  index: number;
  question: string;
  answer?: string;
  placeholder?: string;
  isEditing: boolean;
  onEdit?: (
    answer: string,
    isNew: boolean,
    index: number,
    visible: boolean,
    sort: number
  ) => void;
  numRows?: number;
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
  const {
    questionKey,
    isNew,
    index,
    question,
    answer,
    placeholder,
    isEditing,
    onEdit,
    numRows,
  } = props;
  const classes = useStyles();
  return (
    <TextField
      onChange={
        onEdit && isEditing
          ? // TODO: Add support for visible, and sort here (params 3-4)
            e => onEdit(e.target.value, isNew, index, true, 0)
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
      placeholder={placeholder}
      rows={numRows || 4}
      fullWidth
      multiline
      margin="normal"
      variant="outlined"
    />
  );
}
