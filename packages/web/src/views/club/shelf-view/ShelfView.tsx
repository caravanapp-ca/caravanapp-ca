import React, { useMemo } from 'react';
import { Typography, makeStyles } from '@material-ui/core';
import BookList from './BookList';
import {
  ShelfEntry,
  ReadingState,
  SelectedGenre,
  Services,
} from '@caravan/buddy-reading-types';
import GenreChip from '../../../components/GenreChip';

interface ShelfViewProps {
  genres?: Services.GetGenres;
  isEditing: boolean;
  onGenreClick: (key: string, currActive: boolean) => void;
  selectedGenres: SelectedGenre[];
  shelf: ShelfEntry[];
}

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

export default function ShelfView(props: ShelfViewProps) {
  const classes = useStyles();
  const { genres, isEditing, onGenreClick, selectedGenres, shelf } = props;

  const shelfMap = useMemo(() => {
    const map: { [key in ReadingState]: ShelfEntry[] } = {
      current: [],
      notStarted: [],
      read: [],
    };
    shelf.forEach(s => {
      map[s.readingState].push(s);
    });
    return map;
  }, [shelf]);

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
      {shelfMap.current.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Currently Reading
          </Typography>
          <BookList data={shelfMap.current} tertiary="buy" />
        </div>
      )}
      {shelfMap.notStarted.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            To be Read
          </Typography>
          <BookList data={shelfMap.notStarted} tertiary="buy" />
        </div>
      )}
      {shelfMap.read.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography variant={'h6'} className={classes.sectionLabel}>
            Previously Read
          </Typography>
          <BookList data={shelfMap.read} tertiary="buy" />
        </div>
      )}
    </div>
  );
}
