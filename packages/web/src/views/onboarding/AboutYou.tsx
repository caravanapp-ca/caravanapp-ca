import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  ReadingSpeed,
  GroupVibe,
  Services,
  Genre,
  Genres,
} from '@caravan/buddy-reading-types';
import {
  Fab,
  ListItem,
  List,
  ListItemSecondaryAction,
  ListItemText,
  Divider,
} from '@material-ui/core';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import purple from '@material-ui/core/colors/purple';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Clear';
import { getAllProfileQuestions } from '../../services/profile';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import AdapterLink from '../../components/AdapterLink';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#7289da',
    },
  },
});

const useStyles = makeStyles(theme => ({
  formContainer: {
    padding: theme.spacing(6, 4, 6),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
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
}));

interface AboutYouProps {
  user: User | null;
  onContinue: (genres: string[], readingSpeed: string) => void;
  continuing: boolean;
  questions: Services.GetProfileQuestions['questions'];
  answers: QA[];
  onUpdateAnswers: (qKey: string, answer: string, added: boolean) => void;
  onAddQuestion: () => void;
}

const defaultQuestions = {
  question: 'Select a prompt',
  answer: 'And write your answer',
};

interface QA {
  qid: string;
  answer: string;
}

export default function AboutYou(props: AboutYouProps) {
  const classes = useStyles();
  const { questions, answers } = props;

  const minimumRequired = 3;

  const numberOfDefaultToShow = Math.max(minimumRequired - answers.length, 0);

  const questionCard = (
    title: string,
    subtitle: string,
    key: string,
    answered: boolean
  ) => {
    return (
      <Grid
        key={key}
        container
        lg={12}
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
              {subtitle}
            </Typography>
          </CardContent>
          <div className={classes.fabContainer}>
            <Fab
              color={answered ? 'inherit' : 'primary'}
              onClick={() =>
                answered
                  ? props.onUpdateAnswers(key, subtitle, false)
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
        defaultQuestions.answer,
        `${i}`,
        false
      )
    );
  }

  return (
    <>
      <div className={classes.hero}>
        <Typography variant="h6">
          Tell other readers about yourself! <br />
          <br /> Answer at least 3 prompts to display on your profile.
        </Typography>
      </div>
      <div className={classes.progressFraction}>
        <Typography style={{ fontWeight: 'bold' }} color="textSecondary">
          Minimum {minimumRequired}
        </Typography>
      </div>
      <Container className={classes.formContainer} maxWidth="md">
        <Grid container spacing={2}>
          {answers.map(a => {
            const question = questions.find(q => a.qid === q.id);
            if (!question) {
              throw new Error(`Unknown question: ${a.qid}`);
            }
            return questionCard(question.title, a.answer, a.qid, true);
          })}
          {defaultAnswerCards}
        </Grid>
      </Container>
    </>
  );
}
