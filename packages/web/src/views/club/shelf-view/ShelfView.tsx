import React from 'react';

import { ClubShelf, SelectedGenre, Services } from '@caravanapp/types';
import { makeStyles, Typography } from '@material-ui/core';

import GenreChip from '../../../components/GenreChip';
import BookList from './BookList';

const useStyles = makeStyles(theme => ({
  sectionContainer: {
    marginTop: theme.spacing(3),
  },
  sectionLabel: {
    marginBottom: theme.spacing(1),
  },
  genresContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
}));

interface ShelfViewProps {
  genres?: Services.GetGenres;
  isEditing: boolean;
  onGenreClick: (key: string, currActive: boolean) => void;
  selectedGenres: SelectedGenre[];
  shelf: ClubShelf;
}

export default function ShelfView(props: ShelfViewProps) {
  const classes = useStyles();
  const { genres, isEditing, onGenreClick, selectedGenres, shelf } = props;

  return (
    <div>
      {!isEditing && selectedGenres.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Genres
          </Typography>
          <div className={classes.genresContainer}>
            {selectedGenres.map(g => (
              <GenreChip
                key={g.key}
                genreKey={g.key}
                name={g.name}
                active={false}
                clickable={false}
              />
            ))}
          </div>
        </div>
      )}
      {isEditing && genres && (
        <>
          <div className={classes.sectionContainer}>
            <Typography variant={'h6'} className={classes.sectionLabel}>
              Genres
            </Typography>
            <div className={classes.genresContainer}>
              {genres.mainGenres.map(g => (
                <GenreChip
                  key={g}
                  genreKey={g}
                  name={genres.genres[g].name}
                  active={selectedGenres.some(sg => sg.key === g)}
                  clickable={true}
                  onClick={onGenreClick}
                />
              ))}
            </div>
          </div>
          <div className={classes.sectionContainer}>
            <Typography color="textSecondary" style={{ fontStyle: 'italic' }}>
              If you want to edit your shelf, first click Save in the top-right,
              then click Manage Shelf below.
            </Typography>
          </div>
        </>
      )}
      {shelf.current.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Currently Reading
          </Typography>
          <BookList id="current" data={shelf.current} tertiary="buy" />
        </div>
      )}
      {shelf.notStarted.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            To be Read
          </Typography>
          <BookList id="to-be-read" data={shelf.notStarted} tertiary="buy" />
        </div>
      )}
      {shelf.read.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Previously Read
          </Typography>
          <BookList id="previously-read" data={shelf.read} tertiary="buy" />
        </div>
      )}
    </div>
  );
}
