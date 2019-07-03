import React from 'react';
import {
  User,
  Services,
  ProfileQuestion,
  UserQA,
} from '@caravan/buddy-reading-types';
import { Grid, makeStyles, Button, Typography } from '@material-ui/core';
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
  sectionContainer: {
    marginTop: theme.spacing(3),
  },
  sectionLabel: {
    marginBottom: theme.spacing(1),
  },
}));

interface UserQuestionsProps {
  user: User;
  numQuestionsToPreview: number;
  isEditing: boolean;
  onEdit: (field: 'questions', newValue: any) => void;
  questions?: Services.GetProfileQuestions;
  initQuestions?: {
    initAnsweredQs: UserQA[];
    initUnansweredQs: ProfileQuestion[];
  };
}

export default function UserQuestions(props: UserQuestionsProps) {
  const classes = useStyles();
  const {
    user,
    numQuestionsToPreview,
    isEditing,
    onEdit,
    initQuestions,
  } = props;
  const [expanded, setExpanded] = React.useState<boolean>(false);

  const onQuestionsEdit = (
    questionKey: string,
    newAnswer: string,
    visible: boolean,
    sort: number
  ) => {
    if (!initQuestions) {
      return;
    }
    let userQuestionsNew;
    const existingQAIndex = user.questions.findIndex(q => q.id === questionKey);
    if (existingQAIndex === -1) {
      const newQuestion = initQuestions.initUnansweredQs.find(
        q => q.id === questionKey
      );
      if (newQuestion && newQuestion.max > newAnswer.length) {
        userQuestionsNew = [...user.questions];
        userQuestionsNew.push({
          id: newQuestion.id,
          title: newQuestion.title,
          answer: newAnswer,
          userVisible: visible,
          sort,
        });
        userQuestionsNew.sort((a, b) => b.sort - a.sort);
      }
    } else {
      const newObj = { ...user.questions[existingQAIndex], answer: newAnswer };
      userQuestionsNew = [
        ...user.questions.slice(0, existingQAIndex),
        newObj,
        ...user.questions.slice(existingQAIndex + 1),
      ];
    }
    if (userQuestionsNew) {
      onEdit('questions', userQuestionsNew);
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
            {/* TODO: Need a row for every 45 chars. Can pass numRows, defaults to 4. */}
            {initQuestions.initAnsweredQs.map(q => (
              <Grid item xs={12} sm={6}>
                <QuestionAnswer
                  key={q.id}
                  questionKey={q.id}
                  question={q.title}
                  answer={q.answer}
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
              {/* TODO: Need a row for every 45 chars. Can pass numRows, defaults to 4. */}
              {initQuestions.initUnansweredQs.map(q => (
                <Grid item xs={12} sm={6}>
                  <QuestionAnswer
                    key={q.id}
                    questionKey={q.id}
                    question={q.title}
                    answer={''}
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
          {/* TODO: Need a row for every 45 chars. Can pass numRows, defaults to 4. */}
          {questionsToShow.map(q => (
            <Grid item xs={12} sm={6}>
              <QuestionAnswer
                key={q.id}
                questionKey={q.id}
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
