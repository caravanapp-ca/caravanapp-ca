import React from 'react';
import { TextField } from '@material-ui/core';

interface QuestionAnswerProps {
  key: string;
  question: string;
  answer: string;
  numRows?: number;
  editable?: true;
  onEdit?: (newAnswer: string) => void;
}

export default function QuestionAnswer(props: QuestionAnswerProps) {
  const { key, question, answer, numRows, editable, onEdit } = props;
  return (
    <TextField
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
