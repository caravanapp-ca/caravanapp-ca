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
import { Fab } from '@material-ui/core';
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
  },
  progressFraction: {
    padding: theme.spacing(4, 2, 0),
    display: 'flex',
    justifyContent: 'center',
  },
  card: {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  cardContent: {
    flexGrow: 1,
  },
  questionText: {
    fontWeight: 'bold',
    fontStyle: 'italic',
  },
  answerText: {
    fontStyle: 'italic',
  },
  fabContainer: {
    display: 'flex',
    flexDirection: 'row',
    position: 'absolute',
    top: theme.spacing(-3),
    right: theme.spacing(-3),
    zIndex: 1,
  },
}));

interface AboutYouProps {
  user: User | null;
  onContinue: (genres: string[], readingSpeed: string) => void;
  continuing: boolean;
}

export default function AboutYou(props: AboutYouProps) {
  const classes = useStyles();

  const [numAnswered, setNumAnswered] = React.useState(0);

  const minimumRequired: number = 3;

  const questionPrompts: string[] = ['Q1', 'Q2', 'Q3'];

  return (
    <>
      <div className={classes.hero}>
        <Typography variant="h5">
          Tell other readers about yourself! <br />
          <br /> Answer at least 3 prompts to display on your profile.
        </Typography>
      </div>
      <div className={classes.progressFraction}>
        <Typography style={{ fontWeight: 'bold' }}>
          {numAnswered} / {minimumRequired}
        </Typography>
      </div>
      <Container className={classes.formContainer} maxWidth="md">
        <Grid container spacing={4}>
          {questionPrompts.map(c => {
            return (
              <Grid
                container
                lg={12}
                style={{ paddingBottom: theme.spacing(2) }}
              >
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="h2"
                      className={classes.questionText}
                      color="textPrimary"
                    >
                      Select a prompt
                    </Typography>
                    <br />
                    <Typography
                      gutterBottom
                      variant="subtitle1"
                      component="h2"
                      className={classes.answerText}
                    >
                      And write your answer.
                    </Typography>
                  </CardContent>
                  <div className={classes.fabContainer}>
                    <Fab color="primary">
                      <AddIcon />
                    </Fab>
                  </div>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}
