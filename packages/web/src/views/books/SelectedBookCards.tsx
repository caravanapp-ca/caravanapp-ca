import './SelectedBookCards.css';

import React from 'react';

import { GoogleBooks } from '@caravanapp/types';
import {
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Radio,
  Typography,
} from '@material-ui/core';
import { Delete as DeleteIcon } from '@material-ui/icons';

interface SelectedProps {
  selectedBooks: GoogleBooks.Item[];
  firstBookId: string;
  onChangeBookToRead: (book: GoogleBooks.Item) => void;
  onDeleted: (book: GoogleBooks.Item) => void;
  radioValue: string;
}

const useStyles = makeStyles(theme => ({
  cardGrid: {
    padding: 0,
    marginBottom: 30,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
  },
  cardContent: {
    height: '100px',
    flexGrow: 1,
    padding: 10,
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '40px',
    padding: '0px',
  },
}));

export default function SelectedBookCards(props: SelectedProps) {
  const classes = useStyles();
  const {
    selectedBooks,
    firstBookId,
    onChangeBookToRead,
    onDeleted,
    radioValue,
  } = props;

  function onChangeBookToReadLocal(event: React.ChangeEvent<HTMLInputElement>) {
    const targetId = event.target.value;
    const target = selectedBooks.find(book => book.id === targetId);
    if (target) {
      onChangeBookToRead(target);
    }
  }

  return (
    <Container className={classes.cardGrid} maxWidth="md">
      <Grid container spacing={2}>
        {selectedBooks.map(book => (
          <Grid item key={book.id} xs={12} sm={12}>
            <Card className={classes.card}>
              <CardContent className={classes.cardContent}>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                  }}
                >
                  <div>
                    <img
                      style={{
                        width: '50px',
                        height: '80px',
                        overflow: 'hidden',
                        borderRadius: '10%',
                      }}
                      src={
                        ('imageLinks' in book.volumeInfo &&
                          book.volumeInfo.imageLinks.thumbnail) ||
                        'https://www.newel.com/img/inventory/no_image_available_300x300.jpg'
                      }
                      alt=""
                    />
                  </div>
                  <div
                    style={{
                      marginLeft: 10,
                      flexDirection: 'column',
                      width: '100%',
                      justifyContent: 'center',
                    }}
                  >
                    <Typography
                      style={{ fontSize: 16, color: '#8B8B8B' }}
                      variant="h4"
                    >
                      {book.volumeInfo.title.length > 60
                        ? book.volumeInfo.title.substring(0, 60) + '...'
                        : book.volumeInfo.title}
                    </Typography>
                    <Typography
                      style={{ fontSize: 14, color: '#C8C8C8' }}
                      variant="h5"
                    >
                      {('authors' in book.volumeInfo &&
                        book.volumeInfo.authors[0]) ||
                        'Unknown author'}{' '}
                    </Typography>
                    <Typography
                      style={{ fontSize: 14, color: '#C8C8C8' }}
                      variant="h5"
                      component="h6"
                    >
                      {('categories' in book.volumeInfo &&
                        book.volumeInfo.categories) ||
                        'Unknown genre'}{' '}
                    </Typography>
                  </div>
                  <CardActions className={classes.cardActions}>
                    <Radio
                      checked={radioValue === book.id}
                      onChange={onChangeBookToReadLocal}
                      style={{
                        color: '#7289da',
                        position: 'relative',
                        bottom: '6px',
                      }}
                      value={book.id}
                      name="radio-button-demo"
                      inputProps={{ 'aria-label': '2' }}
                    />
                    <IconButton
                      aria-label="Delete"
                      style={{
                        position: 'relative',
                        right: '4px',
                      }}
                      onClick={() => onDeleted(book)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </CardActions>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
