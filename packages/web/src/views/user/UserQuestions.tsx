import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { Grid, makeStyles } from '@material-ui/core';
import QuestionAnswer from '../../components/QuestionAnswer';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
}));

interface UserQuestionsProps {
  user: User;
}

export default function UserQuestions(props: UserQuestionsProps) {
  const classes = useStyles();
  const { user } = props;
  return (
    <Grid container className={classes.root} spacing={2}>
      {/* TODO: Map through questions in user's collection and render here. */}
      {/* TODO: Need a row for every 45 chars. Can pass numRows, defaults to 4. */}
      <Grid item xs={12} sm={6}>
        <QuestionAnswer
          key={'1'}
          question={"I'm constantly re-reading"}
          answer={
            'Meditations by Marcus Aurelius - I earn 100XP each time I read it'
          }
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <QuestionAnswer
          key={'2'}
          question={"I'm looking for a reading group that can"}
          answer={'Help me translate gorgeous poetry into actual English'}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <QuestionAnswer
          key={'3'}
          question={'Favourite fictional book character of all time'}
          answer={'Paul Atreides from Dune'}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <QuestionAnswer
          key={'4'}
          question={'If I could live in one fictional setting'}
          answer={
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed vel sem consequat, rutrum purus faucibus, placerat lectus. Nullam venenatis augue sed neque condimentum pretium. Curabitur et justo eu sem vehicula efficitur et in ante. Integer a quam vitae nunc eleifend facilisis ac eu nibh. Ut volutpat.'
          }
        />
      </Grid>
    </Grid>
  );
}
