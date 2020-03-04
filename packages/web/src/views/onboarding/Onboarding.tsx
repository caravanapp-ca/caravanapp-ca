import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';

import {
  FilterAutoMongoKeys,
  ProfileQuestions,
  ReadingSpeed,
  SelectedGenre,
  Services,
  ShelfEntry,
  User,
  UserQA,
} from '@caravanapp/types';
import { Button, IconButton, Typography } from '@material-ui/core';
import { ArrowBackIos as BackIcon } from '@material-ui/icons';

import DownloadDiscordDialog from '../../components/DownloadDiscordDialog';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import ProfileQuestionsCarousel from '../../components/ProfileQuestionsCarousel';
import { joinMyReferralClubs } from '../../services/club';
import { getAllProfileQuestions } from '../../services/profile';
import { updateUserProfile } from '../../services/user';
import AboutYou from './AboutYou';
import AnswerQuestion from './AnswerQuestion';
import ReadingPreferences from './ReadingPreferences';
import SelectBooks from './SelectBooks';

interface OnboardingRouteParams {
  id: string;
}

interface OnboardingProps extends RouteComponentProps<OnboardingRouteParams> {
  user: User | null;
}

type SubmissionState = 'notSubmitted' | 'submitted' | 'success' | 'failure';

const headerTitle = (label: string) => <HeaderTitle title={label} />;

export default function Onboarding(props: OnboardingProps) {
  const leftComponentAnswerQuestion = (
    <Button color="primary" onClick={onCancelAnswer}>
      <Typography style={{ fontWeight: 600 }}>Cancel</Typography>
    </Button>
  );

  const backButton = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => setCurrentPage(currentPage - 1)}
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

  const [selectedGenres, setSelectedGenres] = React.useState<SelectedGenre[]>(
    []
  );

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

  const [showDiscordDialog, setShowDiscordDialog] = React.useState<boolean>(
    false
  );

  const [hasSeenDiscordDialog, setHasSeenDiscordDialog] = React.useState<
    boolean
  >(false);

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
        window.location.replace('/clubs/recommend?fromOnboarding=true');
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
    if (profileQuestions && Array.isArray(profileQuestions.questions)) {
      const answeredIds = answers.map(a => a.id);
      // Make the unanswered questions not include the ids of the questions they've already answered
      const updatedQuestions = profileQuestions.questions.filter(
        q => !answeredIds.includes(q.id)
      );
      setUnansweredProfileQuestions(updatedQuestions);
    }
  }, [profileQuestions, answers]);

  function onGenreSelected(
    genreKey: string,
    genreName: string,
    selected: boolean
  ) {
    let newGenres: SelectedGenre[] = [];
    if (selected) {
      const addedGenre: SelectedGenre = {
        key: genreKey,
        name: genreName,
      };
      newGenres = [...selectedGenres, addedGenre];
    } else {
      newGenres = selectedGenres.filter(g => g.key !== genreKey);
    }
    setSelectedGenres(newGenres);
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

  function continueFromSelectBooks() {
    if (hasSeenDiscordDialog) {
      submitOnboarding();
    } else {
      setShowDiscordDialog(true);
    }
  }

  function onCloseDiscordDialog() {
    setHasSeenDiscordDialog(true);
    submitOnboarding();
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
      const referralRes = await joinMyReferralClubs();
      if (
        !referralRes ||
        referralRes.status < 200 ||
        (referralRes.status >= 300 && referralRes.status !== 404)
      ) {
        // TODO: Error state
        // Although, this is not a critical issue as they will have a chance to manually join on the next page anyways.
      }
      setSubmitState('success');
    } else {
      setSubmitState('failure');
    }
  }

  return (
    <>
      {currentPage === 1 && (
        <>
          <Header centerComponent={headerTitle('Reading Preferences')} />
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
            centerComponent={headerTitle('About You')}
            leftComponent={backButton}
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
            centerComponent={headerTitle('Select a Prompt')}
            leftComponent={backButton}
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
              centerComponent={headerTitle('Write Answer')}
              leftComponent={leftComponentAnswerQuestion}
              rightComponent={rightComponentAnswerQuestion}
            />
            <AnswerQuestion
              onChangeAnswerText={onChangeAnswerText}
              question={questionBeingAnsweredText}
              onDone={onSaveAnswer}
            />
          </>
        )}
      {currentPage === 5 && (
        <>
          <Header
            centerComponent={headerTitle('To be Read')}
            leftComponent={backButton}
          />
          <SelectBooks
            onContinue={continueFromSelectBooks}
            continuing={submitState === 'submitted'}
            onSubmitSelectedBooks={onSubmitSelectedBooks}
            selectedBooks={selectedBooks}
          />
        </>
      )}
      <DownloadDiscordDialog
        open={showDiscordDialog && !hasSeenDiscordDialog}
        handleClose={onCloseDiscordDialog}
      />
    </>
  );
}
