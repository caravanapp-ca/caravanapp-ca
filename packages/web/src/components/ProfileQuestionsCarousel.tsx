import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { Services } from '@caravan/buddy-reading-types';
import { Typography, Paper, IconButton } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import ClearIcon from '@material-ui/icons/Clear';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    cardGrid: {
      paddingTop: theme.spacing(8),
      paddingBottom: theme.spacing(8),
    },
    card: {
      height: '100%',
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '230px',
    },
    cardText: {
      position: 'absolute',
      left: 0,
      top: 0,
      margin: theme.spacing(3),
    },
    cardButton: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      marginLeft: theme.spacing(3),
      marginBottom: theme.spacing(3),
      marginTop: theme.spacing(5),
    },
    questionText: {
      fontWeight: 600,
    },
    defaultAnswerText: {},
    finishedCard: {
      marginBottom: 50,
      height: '500px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    finishedCardContent: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    explanationPaper: {
      position: 'relative',
      padding: theme.spacing(2),
    },
    explanationDismiss: {
      position: 'absolute',
      top: 0,
      right: 0,
    },
  })
);

interface ProfileQuestionsCarouselProps {
  questions: Services.GetProfileQuestions['questions'];
  onClickAnswer: (qKey: string, q: string) => void;
}

export default function ProfileQuestionsCarousel(
  props: ProfileQuestionsCarouselProps
) {
  const classes = useStyles();
  const { questions } = props;
  const [explanationVisible, setExplanationVisible] = React.useState<boolean>(
    true
  );

  return (
    <main>
      {questions.length > 0 && (
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {explanationVisible && (
              <Grid item key={'explanation'} xs={12}>
                <Paper className={classes.explanationPaper}>
                  <Typography>
                    Browse through the questions below and choose the ones you
                    want to answer!
                  </Typography>
                  <IconButton
                    className={classes.explanationDismiss}
                    onClick={() => setExplanationVisible(false)}
                  >
                    <ClearIcon />
                  </IconButton>
                </Paper>
              </Grid>
            )}
            {questions.map(q => {
              return (
                <Grid item key={q.id} xs={12} sm={6}>
                  <Card className={classes.card}>
                    <CardContent className={classes.cardContent}>
                      <div className={classes.cardText}>
                        <Typography
                          variant="h6"
                          component="h2"
                          color="textPrimary"
                          className={classes.questionText}
                        >
                          {q.title}...
                        </Typography>
                        <Typography
                          variant="subtitle1"
                          component="h2"
                          color="textSecondary"
                          className={classes.defaultAnswerText}
                        >
                          {q.subtitle}
                        </Typography>
                      </div>
                      <div className={classes.cardButton}>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => props.onClickAnswer(q.id, q.title)}
                        >
                          ANSWER
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Container>
      )}
      {questions.length === 0 && (
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            <Grid item key={'explanation'} xs={12} sm={12}>
              <Card className={classes.finishedCard}>
                <CardContent className={classes.finishedCardContent}>
                  <Typography variant="h5" style={{ fontWeight: 600 }}>
                    You've answered them all{' '}
                    <span role="img" aria-label="Congrats">
                      🎊
                    </span>{' '}
                    Your profile is officially a work of art.
                    <br /> <br />
                    Sit back and bask in the glory that is your 100% completed,
                    exquisite masterpiece of a profile.
                    <br />
                    <br />
                    You're an inspiration to us all 🙌🏿
                    <br />
                    <br />
                    Sincerely,
                    <br />
                    <br />
                    The Caravan Team
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      )}
    </main>
  );
}
