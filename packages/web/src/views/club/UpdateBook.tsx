import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Typography,
  Switch,
  Button,
  Box,
  Container,
} from '@material-ui/core';
import { MoreVert, ArrowBack } from '@material-ui/icons';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { RouteComponentProps } from 'react-router-dom';
import { User, ShelfEntry } from '@caravan/buddy-reading-types';
import BookList from './shelf-view/BookList';

interface UpdateBookRouteParams {
  id: string;
}

interface UpdateBookProps extends RouteComponentProps<UpdateBookRouteParams> {
  user: User | null;
}

const useStyles = makeStyles(theme => ({
  finishedSwitchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const dummyData: ShelfEntry[] = [
  {
    genres: ['Fantasy', 'Fiction'],
    isbn: '075640407X',
    readingState: 'current',
    startedReading: new Date('2019-06-02T00:00:00.000Z'),
    title: 'The Name of the Wind',
    author: 'Patrick Rothfuss',
    publishedDate: '2007-03-27T00:00:00.000Z',
    coverImageURL: 'https://images.gr-assets.com/books/1515589515l/186074.jpg',
    createdAt: '2019-06-19T22:24:26.126Z',
    updatedAt: '2019-06-19T22:24:26.126Z',
  },
];

export default function UpdateBook(props: UpdateBookProps) {
  const classes = useStyles();

  const [finished, setFinished] = React.useState(true);

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => props.history.goBack()}
    >
      <ArrowBack />
    </IconButton>
  );

  const centerComponent = <Typography variant="h6">Update Club</Typography>;

  const rightComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="More"
      component={AdapterLink}
      to="/"
    >
      <MoreVert />
    </IconButton>
  );

  return (
    <div>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container>
        <Box>
          <Typography>Your club is currently reading:</Typography>
          <BookList data={dummyData} />
          <div className={classes.finishedSwitchContainer}>
            <Switch
              checked={finished}
              onChange={(event, checked) => {
                setFinished(checked);
              }}
              value="finished"
              color="primary"
              inputProps={{ 'aria-label': 'primary checkbox' }}
            />
            <Typography>We finished Kafka on the Shore</Typography>
          </div>
          <Typography>
            Here are the books in your club's Want to Read list. You can pick
            one for your next read.
          </Typography>
          <BookList data={dummyData} />
          <Typography>Or you can search for another book.</Typography>
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
            onClick={() => {}}
          >
            SAVE
          </Button>
        </Box>
      </Container>
    </div>
  );
}
