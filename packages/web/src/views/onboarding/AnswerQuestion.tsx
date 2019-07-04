import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textContainer: {
      padding: theme.spacing(8, 2, 8),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
    },
    card: {
      width: '100%',
    },
    questionText: {
      fontWeight: 600,
    },
    cardHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(5, 3, 0),
      justifyContent: 'center',
    },
    sectionContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(4),
      alignItems: 'flex-end',
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
}

export default function AnswerQuestion(props: AnswerQuestionProps) {
  const classes = useStyles();

  return (
    <Container className={classes.textContainer} maxWidth="md">
      <Card className={classes.card}>
        <CardHeader
          title={`${props.question}...`}
          classes={{ title: classes.questionText, root: classes.cardHeader }}
        />
        <CardContent>
          <div className={classes.sectionContainer}>
            <TextField
              id="outlined-multiline-static"
              label="My Answer"
              multiline
              fullWidth
              rows="17"
              variant="outlined"
              inputProps={{ maxLength: 300 }}
              onChange={(
                e: React.ChangeEvent<
                  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
                >
              ) => props.onChangeAnswerText(e)}
            />
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
