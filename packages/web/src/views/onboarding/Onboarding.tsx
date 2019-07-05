import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  User,
  ShelfEntry,
  ReadingSpeed,
  Services,
  ProfileQuestions,
  UserQA,
  UserSelectedGenre,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Header from '../../components/Header';
import ReadingPreferences from './ReadingPreferences';
import AboutYou from './AboutYou';
import AnswerQuestion from './AnswerQuestion';
import ProfileQuestionsCarousel from '../../components/ProfileQuestionsCarousel';
import SelectBooks from './SelectBooks';
import JoinClubs from './JoinClubs';
import { getAllProfileQuestions } from '../../services/profile';
import { updateUserProfile } from '../../services/user';

interface OnboardingRouteParams {
  id: string;
}

interface OnboardingProps extends RouteComponentProps<OnboardingRouteParams> {
  user: User | null;
}

type SubmissionState = 'notSubmitted' | 'submitted' | 'success' | 'failure';

const centerComponentReadingPreferences = (
  <Typography variant="h6">Reading Preferences</Typography>
);

const centerComponentAboutYou = <Typography variant="h6">About You</Typography>;

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

export default function Onboarding(props: OnboardingProps) {
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
    <Button color="primary" onClick={onCancelAnswer}>
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

  const [currentPage, setCurrentPage] = React.useState(1);

  const [selectedSpeed, setSelectedSpeed] = React.useState<ReadingSpeed>(
    'moderate'
  );

  const [selectedGenres, setSelectedGenres] = React.useState<
    UserSelectedGenre[]
  >([]);

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

  const [selectedBooks, setSelectedBooks] = React.useState<
    FilterAutoMongoKeys<ShelfEntry>[]
  >([]);

  const [submitState, setSubmitState] = React.useState<SubmissionState>(
    'notSubmitted'
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
    switch (submitState) {
      case 'success':
        // Not history replace since have to reload the user object,
        // which isn't done using history.replace
        window.location.replace('/clubs');
        break;
      case 'failure':
        // TODO: handle errors for onboarding submission
        console.error('error in submission');
        break;
      default:
        break;
    }
  }, [submitState]);

  useEffect(() => {
    const getUnansweredProfileQuestions = async () => {
      if (profileQuestions) {
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

  function onGenreSelected(
    genreKey: string,
    genreName: string,
    selected: boolean
  ) {
    if (selected) {
      let newGenres: UserSelectedGenre[];
      const addedGenre: UserSelectedGenre = {
        key: genreKey,
        name: genreName,
      };
      newGenres = [...selectedGenres, addedGenre];
      setSelectedGenres(newGenres);
    } else {
      const updatedGenres = selectedGenres.filter(g => g.key !== genreKey);
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
      setAnswers(newAnswers);
    } else {
      const updatedAnswers = answers.filter(a => a.id !== qKey);
      for (let i = 0; i < updatedAnswers.length; i++) {
        updatedAnswers[i].sort = i;
      }
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

  function onSubmitSelectedBooks(
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[]
  ) {
    setSelectedBooks(selectedBooks);
  }

  async function submitOnboarding() {
    setSubmitState('submitted');
    const res = await updateUserProfile({
      selectedGenres,
      notStartedShelf: selectedBooks,
      readingSpeed: selectedSpeed,
      questions: answers,
      onboardingVersion: 1,
    });
    if (res.status >= 200 && res.status < 300) {
      setSubmitState('success');
    } else {
      setSubmitState('failure');
    }
  }

  return (
    <>
      {currentPage === 1 && (
        <>
          <Header centerComponent={centerComponentReadingPreferences} />
          <ReadingPreferences
            continuing={false}
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
            continuing={false}
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
            onContinue={submitOnboarding}
            continuing={submitState === 'submitted'}
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
