import React from 'react';
import { User } from '@caravan/buddy-reading-types';
import { Grid, makeStyles, Button } from '@material-ui/core';
import QuestionAnswer from '../../components/QuestionAnswer';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  showMoreContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));

interface UserQuestionsProps {
  user: User;
  numQuestionsToPreview: number;
}

export default function UserQuestions(props: UserQuestionsProps) {
  const classes = useStyles();
  const { user, numQuestionsToPreview } = props;
  const [expanded, setExpanded] = React.useState<boolean>(false);

  let questionsToShow = [...user.questions];
  let questionsHidden = user.questions.length - numQuestionsToPreview;
  let expandLabel = 'COLLAPSE';
  if (!expanded && questionsHidden > 0) {
    questionsToShow = questionsToShow.slice(0, numQuestionsToPreview);
    expandLabel = `SHOW ${questionsHidden} MORE`;
  }

  return (
    <>
      <Grid container className={classes.root} spacing={2}>
        {/* TODO: Need a row for every 45 chars. Can pass numRows, defaults to 4. */}
        {questionsToShow.map(q => (
          <Grid item xs={12} sm={6}>
            <QuestionAnswer key={q.id} question={q.title} answer={q.answer} />
          </Grid>
        ))}
      </Grid>
      {questionsHidden > 0 && (
        <div className={classes.showMoreContainer}>
          <Button color="primary" onClick={() => setExpanded(!expanded)}>
            {expandLabel}
          </Button>
        </div>
      )}
    </>
  );
}
