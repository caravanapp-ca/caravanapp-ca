import React from 'react';

import { Services, User, UserQA } from '@caravanapp/types';
import {
  Card,
  CardContent,
  Container,
  Fab,
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import {
  Add as AddIcon,
  ArrowForwardIos as ForwardIcon,
  Clear as RemoveIcon,
} from '@material-ui/icons';

const useStyles = makeStyles(theme => ({
  formContainer: {
    padding: theme.spacing(6, 4, 6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 50,
  },
  hero: {
    padding: theme.spacing(6, 2, 2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  progressFraction: {
    padding: theme.spacing(4, 2, 0),
    display: 'flex',
    justifyContent: 'center',
  },
  defaultCard: {
    height: '100%',
    width: '100%',
    display: 'flex',
    outlineStyle: 'dashed',
    outlineColor: '#D3D3D3',
    outlineWidth: 'thin',
  },
  answeredCard: {
    height: '100%',
    width: '100%',
    display: 'flex',
  },
  cardContent: {
    flexGrow: 1,
  },
  questionText: {
    fontWeight: 600,
  },
  defaultQuestionText: {
    fontStyle: 'italic',
    fontWeight: 600,
  },
  answerText: {},
  defaultAnswerText: {
    fontStyle: 'italic',
  },
  fabContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  questionList: {
    backgroundColor: theme.palette.background.paper,
  },
  questionPrompt: {
    marginBottom: theme.spacing(2),
  },
  sectionContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(4),
    alignItems: 'flex-end',
  },
}));

interface AboutYouProps {
  user: User | null;
  onContinue: () => void;
  continuing: boolean;
  questions: Services.GetProfileQuestions['questions'];
  answers: UserQA[];
  onUpdateAnswers: (
    title: string,
    userVisible: boolean,
    sort: number,
    qKey: string,
    answer: string,
    added: boolean
  ) => void;
  onAddQuestion: () => void;
}

const defaultQuestions = {
  question: 'Select a prompt',
  answer: 'And write your answer',
  userVisible: true,
};

export default function AboutYou(props: AboutYouProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { questions, answers } = props;

  const minimumRequired = 3;

  const numberOfDefaultToShow = Math.max(minimumRequired - answers.length, 1);

  const questionCard = (
    title: string,
    userVisible: boolean,
    sort: number,
    key: string,
    answer: string,
    answered: boolean
  ) => {
    return (
      <Grid
        key={key}
        container
        direction="row"
        justify="center"
        alignItems="center"
        style={{ paddingBottom: theme.spacing(2) }}
      >
        <Card className={answered ? classes.answeredCard : classes.defaultCard}>
          <CardContent className={classes.cardContent}>
            <Typography
              gutterBottom
              variant="body1"
              component="h2"
              color={answered ? 'textPrimary' : 'textSecondary'}
              className={
                answered ? classes.questionText : classes.defaultQuestionText
              }
            >
              {title}
            </Typography>
            <Typography
              gutterBottom
              variant="body2"
              component="h2"
              color={answered ? 'textPrimary' : 'textSecondary'}
              className={
                answered ? classes.answerText : classes.defaultAnswerText
              }
            >
              {answer}
            </Typography>
          </CardContent>
          <div className={classes.fabContainer}>
            <Fab
              color={answered ? 'inherit' : 'primary'}
              onClick={() =>
                answered
                  ? props.onUpdateAnswers(
                      title,
                      userVisible,
                      sort,
                      key,
                      answer,
                      false
                    )
                  : props.onAddQuestion()
              }
            >
              {answered ? <RemoveIcon /> : <AddIcon />}
            </Fab>
          </div>
        </Card>
      </Grid>
    );
  };

  const defaultAnswerCards: JSX.Element[] = [];
  for (let i = 0; i < numberOfDefaultToShow; i++) {
    defaultAnswerCards.push(
      questionCard(
        defaultQuestions.question,
        true,
        0,
        `${i}`,
        defaultQuestions.answer,
        false
      )
    );
  }

  let progressLabel = `Minimum ${minimumRequired}`;
  if (answers.length >= minimumRequired) {
    progressLabel = 'Keep answering to fill out your profile!';
  }

  return (
    <>
      <div className={classes.hero}>
        <Typography variant="h6">
          Tell other readers about yourself by answering some book-related
          prompts.
        </Typography>
      </div>
      <div className={classes.progressFraction}>
        <Typography
          style={{ fontWeight: 600, fontStyle: 'italic' }}
          color="textSecondary"
        >
          {progressLabel}
        </Typography>
      </div>
      <Container className={classes.formContainer} maxWidth="md">
        <Grid container spacing={2}>
          {answers.map((a, index) => {
            const question = questions.find(q => a.id === q.id);
            if (!question) {
              throw new Error(`Unknown question: ${a.id}`);
            }
            return questionCard(
              question.title,
              true,
              index,
              a.id,
              a.answer,
              true
            );
          })}
          {defaultAnswerCards}
        </Grid>
        <div className={classes.sectionContainer}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Fab
              disabled={props.answers.length < 3}
              color="secondary"
              onClick={() => props.onContinue()}
            >
              <ForwardIcon />
            </Fab>
          </div>
        </div>
      </Container>
    </>
  );
}
