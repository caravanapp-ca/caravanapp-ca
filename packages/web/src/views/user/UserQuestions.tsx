import React from 'react';
import {
  User,
  Services,
  ProfileQuestion,
  UserQA,
} from '@caravan/buddy-reading-types';
import { Grid, makeStyles, Button, Typography } from '@material-ui/core';
import QuestionAnswer from '../../components/QuestionAnswer';
import { UserQAwMinMax } from './User';

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
  sectionContainer: {
    marginTop: theme.spacing(3),
  },
  sectionLabel: {
    marginBottom: theme.spacing(1),
  },
}));

interface UserQuestionsProps {
  user: User;
  userIsMe: boolean;
  numQuestionsToPreview: number;
  isEditing: boolean;
  onEdit: (field: 'questions', newValue: any) => void;
  questions?: Services.GetProfileQuestions;
  initQuestions?: {
    initAnsweredQs: UserQAwMinMax[];
    initUnansweredQs: ProfileQuestion[];
  };
  userQuestionsWkspc: UserQA[];
}

export default function UserQuestions(props: UserQuestionsProps) {
  const classes = useStyles();
  const {
    user,
    userIsMe,
    numQuestionsToPreview,
    isEditing,
    onEdit,
    initQuestions,
    userQuestionsWkspc,
  } = props;
  const [expanded, setExpanded] = React.useState<boolean>(false);

  if (user && !isEditing && user.questions.length === 0) {
    const noQAMessage = userIsMe
      ? "You haven't answered any questions yet! Click edit in the top right to express yourself!"
      : 'This user has not yet answered any questions.';
    return (
      <Typography color="textSecondary" style={{ fontStyle: 'italic' }}>
        {noQAMessage}
      </Typography>
    );
  }

  const onQuestionsEdit = (
    id: string,
    index: number,
    answer: string,
    visible: boolean,
    sort: number
  ) => {
    if (!initQuestions) {
      return;
    }
    const existingQAIndex = userQuestionsWkspc.findIndex(qa => qa.id === id);
    if (existingQAIndex === -1 && answer.length === 0) {
      // Do nothing
      return;
    }
    let userQuestionsWkspcNew;
    if (existingQAIndex >= 0) {
      // Question already answered.
      if (answer.length === 0) {
        // Delete the existing answer
        userQuestionsWkspcNew = [...userQuestionsWkspc];
        userQuestionsWkspcNew.splice(existingQAIndex, 1);
      } else {
        // Modify the existing answer
        const editedQuestion = {
          ...userQuestionsWkspc[existingQAIndex],
          answer: answer,
        };
        userQuestionsWkspcNew = [...userQuestionsWkspc];
        userQuestionsWkspcNew[existingQAIndex] = editedQuestion;
      }
    } else {
      // New question
      const newQuestion = initQuestions.initUnansweredQs[index];
      if (newQuestion && newQuestion.max > answer.length) {
        userQuestionsWkspcNew = [...userQuestionsWkspc];
        userQuestionsWkspcNew.push({
          id: newQuestion.id,
          title: newQuestion.title,
          answer: answer,
          userVisible: visible,
          sort,
        });
      }
    }
    if (userQuestionsWkspcNew) {
      onEdit('questions', userQuestionsWkspcNew);
    }
  };

  let questionsToShow = [...user.questions];
  let questionsHidden = user.questions.length - numQuestionsToPreview;
  let expandLabel = 'COLLAPSE';
  if (!expanded && questionsHidden > 0) {
    questionsToShow = questionsToShow.slice(0, numQuestionsToPreview);
    expandLabel = `SHOW ${questionsHidden} MORE`;
  }

  if (isEditing && onEdit && initQuestions) {
    return (
      <>
        <div className={classes.sectionContainer}>
          <Typography color="primary" className={classes.sectionLabel}>
            Your Answers
          </Typography>
          <Grid container className={classes.root} spacing={2}>
            {initQuestions.initAnsweredQs.map((q, i) => (
              <Grid item key={q.id} xs={12} sm={6}>
                <QuestionAnswer
                  key={q.id}
                  questionKey={q.id}
                  isNew={false}
                  index={i}
                  question={q.title}
                  answer={q.answer}
                  maxLength={q.max}
                  minLength={q.min}
                  isEditing={isEditing}
                  onEdit={onQuestionsEdit}
                />
              </Grid>
            ))}
          </Grid>
        </div>
        {initQuestions.initUnansweredQs && (
          <div className={classes.sectionContainer}>
            <Typography color="primary" className={classes.sectionLabel}>
              New Questions
            </Typography>
            <Grid container className={classes.root} spacing={2}>
              {initQuestions.initUnansweredQs.map((q, i) => (
                <Grid key={q.id} item xs={12} sm={6}>
                  <QuestionAnswer
                    key={q.id}
                    questionKey={q.id}
                    isNew={true}
                    index={i}
                    question={q.title}
                    placeholder={q.subtitle}
                    maxLength={q.max}
                    minLength={q.min}
                    isEditing={isEditing}
                    onEdit={onQuestionsEdit}
                  />
                </Grid>
              ))}
            </Grid>
          </div>
        )}
      </>
    );
  } else {
    return (
      <>
        <Grid container className={classes.root} spacing={2}>
          {questionsToShow.map((q, i) => (
            <Grid key={q.id} item xs={12} sm={6}>
              <QuestionAnswer
                key={q.id}
                questionKey={q.id}
                isNew={false}
                index={i}
                question={q.title}
                answer={q.answer}
                isEditing={isEditing}
                onEdit={onQuestionsEdit}
              />
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
}
