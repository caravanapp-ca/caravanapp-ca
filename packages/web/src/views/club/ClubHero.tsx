import React from 'react';
import { ShelfEntry } from '@caravan/buddy-reading-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  bgImage: (props: { backgroundImage: string | undefined }) => ({
    'background-image': `url(${props.backgroundImage})`,
    display: 'block',
    width: '100%',
    height: '200px',
    'object-fit': 'cover',
    filter: 'blur(8px)',
    'background-position': 'center',
    'background-repeat': 'no-repeat',
    'background-size': 'cover',
  }),
  bgShade: {
    width: '100%',
    height: '100%',
    'background-color': 'rgba(0, 0, 0, 0.4)',
  },
  headerTextContainer: {
    position: 'absolute',
    left: '32px',
    top: '80px',
  },
}));

interface ClubHeroProps {
  currBook: ShelfEntry;
}

export default function ClubHero(props: ClubHeroProps) {
  const {
    title,
    author,
    publishedDate,
    genres,
    coverImageURL,
  } = props.currBook;
  const styleProps = { backgroundImage: coverImageURL };
  const classes = useStyles(styleProps);

  // This adjusts for casting of Date objects to string when sent from web-api
  let dateObj;
  if (publishedDate) {
    dateObj = new Date(publishedDate);
  }

  let authorDateString;
  if (author || dateObj) {
    if (author && dateObj) {
      authorDateString = `${author}, ${dateObj.getUTCFullYear()}`;
    } else if (author && !dateObj) {
      authorDateString = author;
    } else if (!author && dateObj) {
      authorDateString = dateObj.getUTCFullYear();
    }
  }

  return (
    <div>
      <div className={`${classes.bgImage}`}>
        <div className={`${classes.bgShade}`} />
      </div>
      <div className={`${classes.headerTextContainer}`}>
        <Typography>Currently Reading</Typography>
        <Typography>{title}</Typography>
        {authorDateString && <Typography>{authorDateString}</Typography>}
        {genres && <Typography>{genres.join(', ')}</Typography>}
      </div>
    </div>
  );
}
