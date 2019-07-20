import React from 'react';
import { TextField, makeStyles } from '@material-ui/core';

interface QuestionAnswerProps {
  questionKey: string;
  question: string;
  isEditing: boolean;
  index?: number;
  answer?: string;
  placeholder?: string;
  numRows?: number;
  rowsMax?: number;
  minLength?: number;
  maxLength?: number;
  hideHelperText?: boolean;
  onEdit?: (
    id: string,
    index: number,
    answer: string,
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
  const {
    questionKey,
    index,
    question,
    answer,
    placeholder,
    numRows,
    rowsMax,
    maxLength,
    hideHelperText,
    isEditing,
    onEdit,
  } = props;
  const ref = React.createRef<HTMLDivElement>();
  const classes = useStyles();
  const [focused, setFocused] = React.useState<boolean>(false);
  const [currValue, setCurrValue] = React.useState<string>(answer || '');
  return (
    <TextField
      ref={ref}
      onChange={
        onEdit && isEditing && index
          ? // TODO: Add support for visible, and sort here (params 3-4)
            e => {
              onEdit(questionKey, index, e.target.value, true, 0);
              setCurrValue(e.target.value);
            }
          : undefined
      }
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      disabled={!(onEdit && isEditing)}
      InputProps={{
        classes: {
          root: classes.root,
          disabled: classes.disabled,
          notchedOutline: classes.notchedOutline,
        },
      }}
      inputProps={{ maxLength }}
      InputLabelProps={{
        classes: {
          disabled: classes.disabledLabel,
        },
      }}
      id={questionKey}
      label={question}
      defaultValue={answer}
      placeholder={placeholder}
      rows={numRows && numRows >= 1 ? numRows : 4}
      rowsMax={
        rowsMax && rowsMax >= 1 && (!numRows || rowsMax >= numRows)
          ? rowsMax
          : 7
      }
      helperText={
        hideHelperText
          ? undefined
          : focused && maxLength
          ? `${maxLength - currValue.length} chars remaining`
          : ' '
      }
      fullWidth
      multiline
      margin="normal"
      variant="outlined"
    />
  );
}
