import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import { Paper, Typography, Button, useTheme } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textContainer: {
      // padding: theme.spacing(8, 2, 8),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    questionPaper: {
      padding: theme.spacing(2),
      marginTop: theme.spacing(16),
      marginBottom: theme.spacing(22),
      flexGrow: 1,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      width: '100%',
    },
  })
);

interface AnswerQuestionProps {
  onChangeAnswerText: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  question: string;
  onDone: () => void;
}

export default function AnswerQuestion(props: AnswerQuestionProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { question, onChangeAnswerText, onDone } = props;
  const [currValue, setCurrValue] = React.useState<string>('');

  return (
    <Container className={classes.textContainer} maxWidth="md">
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item sm={9} xs={12}>
          <Paper className={classes.questionPaper}>
            <Typography
              variant="h6"
              style={{ fontWeight: 600, marginBottom: theme.spacing(2) }}
            >
              {`${question}...`}
            </Typography>
            <TextField
              id={`question-textfield`}
              label="My Answer"
              multiline
              fullWidth
              rows="8"
              variant="outlined"
              inputProps={{ maxLength: 300 }}
              helperText={`${300 - currValue.length} chars remaining`}
              onChange={(
                e: React.ChangeEvent<
                  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
              ) => {
                onChangeAnswerText(e);
                setCurrValue(e.target.value);
              }}
              style={{ marginBottom: theme.spacing(2) }}
            />
            <div className={classes.buttonContainer}>
              <Button
                color="primary"
                variant="contained"
                onClick={() => onDone()}
                disabled={currValue.split(' ').join('').length === 0}
              >
                <Typography variant="button">DONE</Typography>
              </Button>
            </div>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
