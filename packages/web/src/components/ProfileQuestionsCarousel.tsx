import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Paper from '@material-ui/core/Paper';
import { Services } from '@caravan/buddy-reading-types';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      padding: theme.spacing(10, 0, 0),
      color: theme.palette.text.secondary,
    },
    gridList: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
      width: '90%',
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      // background:
      //   'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
    },
    paper: {
      height: '80%',
      position: 'relative',
      color: theme.palette.text.secondary,
      borderRadius: '25px',
      border: '2px solid #D3D3D3',
    },
    textDiv: {
      padding: theme.spacing(15, 2, 5),
    },
    questionText: {
      fontWeight: 600,
      paddingBottom: theme.spacing(3),
    },
    defaultAnswerText: {
      fontStyle: 'italic',
    },
    buttonDiv: {
      position: 'absolute',
      bottom: 30,
      left: 30,
    },
  })
);

interface ProfileQuestionsCarouselProps {
  questions: Services.GetProfileQuestions['questions'];
}

export default function ProfileQuestionsCarousel(
  props: ProfileQuestionsCarouselProps
) {
  const classes = useStyles();

  const { questions } = props;

  return (
    <div className={classes.root}>
      <GridList className={classes.gridList} cols={2.5}>
        {questions.map(question => (
          <GridListTile
            key={question.id}
            cols={1}
            rows={4}
            style={{ backgroundColor: 'white' }}
          >
            <Paper className={classes.paper}>
              <div className={classes.textDiv}>
                <Typography
                  variant="h5"
                  component="h2"
                  color="textPrimary"
                  className={classes.questionText}
                >
                  {question.title}...
                </Typography>
                <Typography
                  variant="h6"
                  component="h2"
                  color="textSecondary"
                  className={classes.defaultAnswerText}
                >
                  {question.subtitle}
                </Typography>
              </div>
              <div className={classes.buttonDiv}>
                <Button variant="contained" color="primary">
                  ANSWER
                </Button>
              </div>
            </Paper>
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
