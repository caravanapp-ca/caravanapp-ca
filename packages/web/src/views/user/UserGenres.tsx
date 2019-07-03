import React from 'react';
import { User, Services } from '@caravan/buddy-reading-types';
import GenreChip from '../../components/GenreChip';
import { makeStyles, Button } from '@material-ui/core';

interface UserGenresProps {
  user: User;
  isEditing: boolean;
  onEdit: (
    field: 'selectedGenres',
    newValue: { key: string; name: string }[]
  ) => void;
  genres?: Services.GetGenres;
}

const useStyles = makeStyles(theme => ({
  genresContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  showMoreContainer: {
    display: 'flex',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
}));

export default function UserGenres(props: UserGenresProps) {
  const classes = useStyles();
  const { user, isEditing, onEdit, genres } = props;
  const [showAll, setShowAll] = React.useState<boolean>(false);

  const onGenreClick = (key: string, currActive: boolean) => {
    if (!currActive && genres) {
      const selectedGenresNew = [...user.selectedGenres];
      selectedGenresNew.push({
        key,
        name: genres.genres[key].name,
      });
      onEdit('selectedGenres', selectedGenresNew);
    } else if (currActive && genres) {
      const selectedGenresNew = user.selectedGenres.filter(
        sg => sg.key !== key
      );
      onEdit('selectedGenres', selectedGenresNew);
    }
  };

  if (isEditing && onEdit && genres && showAll) {
    return (
      <>
        <div className={classes.showMoreContainer}>
          <Button color="primary" onClick={() => setShowAll(false)}>
            DONE
          </Button>
        </div>
        <div className={classes.genresContainer}>
          {genres.mainGenres.map(g => (
            <GenreChip
              key={g}
              genreKey={g}
              name={genres.genres[g].name}
              active={user.selectedGenres.some(sg => sg.key === g)}
              clickable={true}
              onClick={onGenreClick}
            />
          ))}
        </div>
      </>
    );
  } else {
    return (
      <>
        {isEditing && onEdit && genres && !showAll && (
          <div className={classes.showMoreContainer}>
            <Button color="primary" onClick={() => setShowAll(true)}>
              EDIT
            </Button>
          </div>
        )}
        <div className={classes.genresContainer}>
          {user.selectedGenres.map(g => (
            <GenreChip
              key={g.key}
              genreKey={g.key}
              name={g.name}
              active={false}
            />
          ))}
        </div>
      </>
    );
  }
}
