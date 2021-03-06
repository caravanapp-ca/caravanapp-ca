import React from 'react';

import { FilterAutoMongoKeys, ShelfEntry } from '@caravanapp/types';
import {
  CircularProgress,
  Container,
  colors,
  createMuiTheme,
  Fab,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { ArrowForwardIos as ForwardIcon } from '@material-ui/icons';

import BookSearch from '../books/BookSearch';

const theme = createMuiTheme({
  palette: {
    primary: colors.purple,
    secondary: {
      main: '#7289da',
    },
  },
});

const useStyles = makeStyles(theme => ({
  hero: {
    padding: theme.spacing(6, 2, 2),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  progressFraction: {
    padding: theme.spacing(4, 2, 0),
    display: 'flex',
    justifyContent: 'center',
  },
  defaultCard: {
    height: '100%',
    width: '100%',
    display: 'flex',
    outlineStyle: 'dashed',
    outlineColor: '#D3D3D3',
    outlineWidth: 'thin',
  },
  answeredCard: {
    height: '100%',
    width: '100%',
    display: 'flex',
  },
  cardContent: {
    flexGrow: 1,
  },
  questionText: {
    fontWeight: 600,
  },
  defaultQuestionText: {
    fontStyle: 'italic',
    fontWeight: 600,
  },
  answerText: {},
  defaultAnswerText: {
    fontStyle: 'italic',
  },
  fabContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
  },
  questionList: {
    backgroundColor: theme.palette.background.paper,
  },
  questionPrompt: {
    marginBottom: theme.spacing(2),
  },
  sectionContainer: {
    marginTop: theme.spacing(4),
  },
}));

interface SelectBookProps {
  onContinue: () => void;
  onSubmitSelectedBooks: (
    selectedBooks: FilterAutoMongoKeys<ShelfEntry>[]
  ) => void;
  selectedBooks: FilterAutoMongoKeys<ShelfEntry>[];
  continuing: boolean;
}

const minimumRequired = 3;

export default function SelectBooks(props: SelectBookProps) {
  const classes = useStyles();
  const { selectedBooks, continuing } = props;

  let progressText = `Minimum ${minimumRequired}, but the more the merrier!`;
  if (selectedBooks.length >= minimumRequired) {
    progressText = 'Keep going! The bigger the shelf the better 😊';
  }

  return (
    <>
      <div className={classes.hero}>
        <Typography variant="h6">
          Add books to your shelf to find other readers to read with!
        </Typography>
      </div>
      <div className={classes.progressFraction}>
        <Typography
          style={{ fontWeight: 600, fontStyle: 'italic' }}
          color="textSecondary"
        >
          {progressText}
        </Typography>
      </div>
      <Container
        style={{
          padding: theme.spacing(2),
          marginBottom:
            selectedBooks.length === 0
              ? 270
              : selectedBooks.length === 1
              ? 170
              : 50,
        }}
        maxWidth="md"
      >
        <div className={classes.sectionContainer}>
          <Typography variant="subtitle1">
            What books would you like to read?
          </Typography>
          <BookSearch
            onSubmitBooks={props.onSubmitSelectedBooks}
            maxSelected={10000}
            secondary={'delete'}
            initialSelectedBooks={selectedBooks}
          />
        </div>
        <div className={classes.sectionContainer}>
          <div
            style={{
              display: 'flex',
              width: '100%',
              justifyContent: 'flex-end',
            }}
          >
            {!continuing && (
              <Fab
                disabled={selectedBooks.length < 3}
                color="secondary"
                onClick={() => props.onContinue()}
                variant="extended"
              >
                <Typography
                  style={{ marginRight: theme.spacing(1) }}
                  variant="button"
                >
                  DONE
                </Typography>
                <ForwardIcon />
              </Fab>
            )}
            {continuing && <CircularProgress />}
          </div>
        </div>
      </Container>
    </>
  );
}
