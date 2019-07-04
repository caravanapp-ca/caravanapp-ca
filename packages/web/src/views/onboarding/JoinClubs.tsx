import React from 'react';
import { Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ForwardIcon from '@material-ui/icons/ArrowForwardIos';
import Typography from '@material-ui/core/Typography';

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
    marginTop: theme.spacing(4),
  },
}));

interface JoinClubProps {
  onContinue: () => void;
}

export default function JoinClub(props: JoinClubProps) {
  const classes = useStyles();

  return (
    <>
      <div className={classes.hero}>
        <Typography variant="h6">
          Here are some clubs we think you'll love. <br /> <br />
          You can join an existing club, or if none of them catch your eye,
          create your own! <br /> <br />
          We automatically create a chat for you, and help you find people.
          <br />
          <br />
          All you gotta do is read!
        </Typography>
      </div>
      <div className={classes.progressFraction}>
        <Typography style={{ fontWeight: 'bold' }} color="textSecondary">
          Join clubs bud
        </Typography>
      </div>
      <Container className={classes.formContainer} maxWidth="md">
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1">
            What books would you like to read?
          </Typography>
        </div>
        <div className={classes.sectionContainer}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <Fab
              disabled={[].length < 3}
              color="primary"
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
