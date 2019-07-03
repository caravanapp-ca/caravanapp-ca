import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ProfileQuestion,
  ShelfEntry,
  ReadingSpeed,
  GroupVibe,
  Services,
  Genre,
  Genres,
  ProfileQuestions,
  UserQA,
} from '@caravan/buddy-reading-types';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import ForwardIcon from '@material-ui/icons/ArrowForwardIos';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Radio from '@material-ui/core/Radio';
import purple from '@material-ui/core/colors/purple';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { saveReadingPreferences } from '../../services/onboarding';
import ReadingPreferences from './ReadingPreferences';
import AboutYou from './AboutYou';
import AnswerQuestion from './AnswerQuestion';
import ProfileQuestionsCarousel from '../../components/ProfileQuestionsCarousel';
import SelectBooks from './SelectBooks';
import JoinClubs from './JoinClubs';
import { getAllGenres } from '../../services/genre';
import {
  readingSpeedIcons,
  readingSpeedLabels,
  readingSpeedSubtitles,
} from '../../components/reading-speed-avatars-icons-labels';
import { getAllProfileQuestions } from '../../services/profile';
import { updateUserProfile } from '../../services/user';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#7289da',
    },
  },
});

const useStyles = makeStyles(theme => ({}));

interface OnboardingRouteParams {
  id: string;
}

interface OnboardingProps extends RouteComponentProps<OnboardingRouteParams> {
  user: User | null;
}

export default function Onboarding(props: OnboardingProps) {
  const classes = useStyles();

  const centerComponentReadingPreferences = (
    <Typography variant="h6">Reading Preferences</Typography>
  );

  const centerComponentAboutYou = (
    <Typography variant="h6">About You</Typography>
  );

  const centerComponentSelectPrompt = (
    <Typography variant="h6">Select a Prompt</Typography>
  );

  const centerComponentAnswerQuestion = (
    <Typography variant="h6">Write Answer</Typography>
  );

  const centerComponentAddBooks = (
    <Typography variant="h6">Add to Your Shelf</Typography>
  );

  const centerComponentJoinClubs = (
    <Typography variant="h6">Join or Start Clubs</Typography>
  );

  const leftComponentAboutYou = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => setCurrentPage(1)}
    >
      <BackIcon />
    </IconButton>
  );

  const leftComponentSelectPrompt = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => setCurrentPage(2)}
    >
      <BackIcon />
    </IconButton>
  );

  const leftComponentAnswerQuestion = (
    <Button color="primary" onClick={() => onCancelAnswer()}>
      <Typography style={{ fontWeight: 600 }}>Cancel</Typography>
    </Button>
  );

  const leftComponentAddBooks = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => setCurrentPage(2)}
    >
      <BackIcon />
    </IconButton>
  );

  const leftComponentJoinClubs = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => setCurrentPage(5)}
    >
      <BackIcon />
    </IconButton>
  );

  const [currentAnswer, setCurrentAnswer] = React.useState('');

  const rightComponentAnswerQuestion = (
    <Button
      color="primary"
      disabled={currentAnswer.split(' ').join('').length === 0}
      onClick={() => onSaveAnswer()}
    >
      <Typography style={{ fontWeight: 600 }}>Done</Typography>
    </Button>
  );

  const [
    continuingToProfileQuestions,
    setContinuingToProfileQuestions,
  ] = React.useState(false);

  const [currentPage, setCurrentPage] = React.useState(5);

  const [
    selectedReadingPreferences,
    setSelectedReadingPreferences,
  ] = React.useState<Services.ReadingPreferencesResult | null>(null);

  const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];

  const [selectedSpeed, setSelectedSpeed] = React.useState<ReadingSpeed>(
    'moderate'
  );

  const [selectedGenres, setSelectedGenres] = React.useState<string[]>([]);

  const [
    profileQuestions,
    setProfileQuestions,
  ] = React.useState<Services.GetProfileQuestions | null>(null);

  const [
    unansweredProfileQuestions,
    setUnansweredProfileQuestions,
  ] = React.useState<ProfileQuestions['questions']>([]);

  const [answers, setAnswers] = React.useState<UserQA[]>([]);

  const [questionBeingAnsweredId, setQuestionBeingAnsweredId] = React.useState<
    string | null
  >(null);

  const [
    questionBeingAnsweredText,
    setQuestionBeingAnsweredText,
  ] = React.useState<string | null>(null);

  const [selectedBooks, setSelectedBooks] = React.useState<ShelfEntry[]>([]);

  const [writingOnboardingToDB, setWritingOnboardingToDB] = React.useState(
    false
  );

  useEffect(() => {
    const getProfileQuestions = async () => {
      const response = await getAllProfileQuestions();
      if (response.status >= 200 && response.status < 300) {
        const { data } = response;
        setProfileQuestions(data);
        setUnansweredProfileQuestions(data.questions);
      }
    };
    getProfileQuestions();
  }, []);

  useEffect(() => {
    const getUnansweredProfileQuestions = async () => {
      if (profileQuestions) {
        console.log(answers);
        console.log(unansweredProfileQuestions);
        // Get all the ids of the questions they've answered and add them to an array
        const answeredIds: string[] = [];
        for (let i = 0; i < answers.length; i++) {
          answeredIds.push(answers[i].id);
        }
        // Make the unanswered questions not include the ids of the questions they've already answered
        const updatedQuestions = profileQuestions.questions.filter(
          q => !answeredIds.includes(q.id)
        );
        setUnansweredProfileQuestions(updatedQuestions);
      }
    };
    getUnansweredProfileQuestions();
  }, [answers]);

  function onGenreSelected(genre: string, selected: boolean) {
    if (selected) {
      let newGenres: string[];
      newGenres = [...selectedGenres, genre];
      setSelectedGenres(newGenres);
    } else {
      const updatedGenres = selectedGenres.filter(g => g !== genre);
      setSelectedGenres(updatedGenres);
    }
  }

  function onSetSelectedSpeed(speed: ReadingSpeed) {
    setSelectedSpeed(speed);
  }

  function continueToQuestionsPage() {
    setCurrentPage(2);
  }

  function onUpdateAnswers(
    title: string,
    userVisible: boolean,
    sort: number,
    qKey: string,
    answer: string,
    added: boolean
  ) {
    if (added && profileQuestions) {
      let newAnswers: UserQA[];
      const newAnswer = {
        id: qKey,
        answer,
        sort,
        userVisible,
        title,
      };
      newAnswers = [...answers, newAnswer];
      console.log('newAnswers');
      console.log(newAnswers);
      setAnswers(newAnswers);
    } else {
      const updatedAnswers = answers.filter(a => a.id !== qKey);
      for (let i = 0; i < updatedAnswers.length; i++) {
        updatedAnswers[i].sort = i;
      }
      console.log('updatedAnswers');
      console.log(updatedAnswers);
      setAnswers(updatedAnswers);
    }
  }

  function onAddQuestion() {
    setCurrentPage(3);
  }

  function onClickAnswer(qKey: string, q: string) {
    setQuestionBeingAnsweredId(qKey);
    setQuestionBeingAnsweredText(q);
    setCurrentPage(4);
  }

  function onChangeAnswerText(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setCurrentAnswer(e.target.value);
  }

  function onSaveAnswer() {
    if (questionBeingAnsweredId && questionBeingAnsweredText) {
      let newAnswers: UserQA[];
      const newAnswer = {
        id: questionBeingAnsweredId,
        answer: currentAnswer,
        sort: answers.length,
        userVisible: true,
        title: questionBeingAnsweredText,
      };
      newAnswers = [...answers, newAnswer];
      setAnswers(newAnswers);
      setCurrentAnswer('');
      setCurrentPage(2);
    }
  }

  function onCancelAnswer() {
    setCurrentAnswer('');
    setCurrentPage(3);
  }

  function continueToBooksPage() {
    setCurrentPage(5);
  }

  function onSubmitSelectedBooks(selectedBooks: ShelfEntry[]) {
    setSelectedBooks(selectedBooks);
  }

  function writeOnboardingDataToDB() {
    setWritingOnboardingToDB(true);
    // const res = await updateUserProfile(
    //   selectedGenres,
    //   selectedBooks,
    //   selectedSpeed,
    //   answers
    // );
  }

  return (
    <>
      {currentPage === 1 && (
        <>
          <Header centerComponent={centerComponentReadingPreferences} />
          <ReadingPreferences
            continuing={continuingToProfileQuestions}
            onContinue={continueToQuestionsPage}
            user={props.user}
            selectedGenres={selectedGenres}
            onGenreSelected={onGenreSelected}
            selectedSpeed={selectedSpeed}
            onSetSelectedSpeed={onSetSelectedSpeed}
          />
        </>
      )}
      {currentPage === 2 && profileQuestions && (
        <>
          <Header
            centerComponent={centerComponentAboutYou}
            leftComponent={leftComponentAboutYou}
          />
          <AboutYou
            continuing={continuingToProfileQuestions}
            onContinue={continueToBooksPage}
            questions={profileQuestions.questions}
            user={props.user}
            answers={answers}
            onUpdateAnswers={onUpdateAnswers}
            onAddQuestion={onAddQuestion}
          />
        </>
      )}
      {currentPage === 3 && profileQuestions && (
        <>
          <Header
            centerComponent={centerComponentSelectPrompt}
            leftComponent={leftComponentSelectPrompt}
          />
          <ProfileQuestionsCarousel
            questions={unansweredProfileQuestions}
            onClickAnswer={onClickAnswer}
          />
        </>
      )}
      {currentPage === 4 &&
        questionBeingAnsweredId &&
        questionBeingAnsweredText && (
          <>
            <Header
              centerComponent={centerComponentAnswerQuestion}
              leftComponent={leftComponentAnswerQuestion}
              rightComponent={rightComponentAnswerQuestion}
            />
            <AnswerQuestion
              onChangeAnswerText={onChangeAnswerText}
              question={questionBeingAnsweredText}
            />
          </>
        )}
      {currentPage === 5 && (
        <>
          <Header
            centerComponent={centerComponentAddBooks}
            leftComponent={leftComponentAddBooks}
          />
          <SelectBooks
            onContinue={writeOnboardingDataToDB}
            continuing={writingOnboardingToDB}
            onSubmitSelectedBooks={onSubmitSelectedBooks}
            selectedBooks={selectedBooks}
          />
        </>
      )}
      {currentPage === 6 && (
        <>
          <Header
            centerComponent={centerComponentJoinClubs}
            leftComponent={leftComponentJoinClubs}
          />
          <JoinClubs onContinue={continueToBooksPage} />
        </>
      )}
    </>
  );
}
