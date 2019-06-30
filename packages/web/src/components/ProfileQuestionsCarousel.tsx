import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import { Services } from '@caravan/buddy-reading-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      width: '100%',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      overflow: 'hidden',
      padding: theme.spacing(10, 0, 10),
    },
    gridList: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
    },
    title: {
      color: theme.palette.primary.light,
    },
    titleBar: {
      background:
        'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 70%, rgba(0,0,0,0) 100%)',
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
          <GridListTile key={question.id}>
            <img src="https://cdn1us.denofgeek.com/sites/denofgeekus/files/harry_potter_footage_rpg_leak.jpeg" />
            <GridListTileBar
              title={question.title}
              classes={{
                root: classes.titleBar,
                title: classes.title,
              }}
              actionIcon={<Button>ANSWER</Button>}
            />
          </GridListTile>
        ))}
      </GridList>
    </div>
  );
}
