import React from 'react';
import { ShelfEntry, FilterAutoMongoKeys } from '@caravan/buddy-reading-types';
import { Fab } from '@material-ui/core';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import ForwardIcon from '@material-ui/icons/ArrowForwardIos';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import purple from '@material-ui/core/colors/purple';
import BookSearch from '../books/BookSearch';

const theme = createMuiTheme({
  palette: {
    primary: purple,
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

  return (
    <>
      <div className={classes.hero}>
        <Typography variant="h6">
          Add books to your shelf to find other readers to read with!
        </Typography>
      </div>
      <div className={classes.progressFraction}>
        {selectedBooks.length < minimumRequired && (
          <Typography style={{ fontWeight: 'bold' }} color="textSecondary">
            Minimum {minimumRequired}, but the more the merrier!
          </Typography>
        )}
        {selectedBooks.length >= minimumRequired && (
          <Typography style={{ fontWeight: 'bold' }} color="textSecondary">
            Keep going! The bigger the shelf the better{' '}
            <span role="img" aria-label="slight smile">
              😊
            </span>
          </Typography>
        )}
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
                color="primary"
                onClick={() => props.onContinue()}
              >
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
