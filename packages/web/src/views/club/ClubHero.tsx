import React from 'react';
import { ShelfEntry } from '@caravan/buddy-reading-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  bgImageContainer: {
    position: 'relative',
    'border-radius': '4px',
    height: '388px',
    width: '100%',
  },
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    'object-fit': 'cover',
    'object-position': '50% 50%',
    filter: 'blur(10px)',
  },
  bgShade: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.4)',
  },
  heroTextContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
    padding: theme.spacing(2),
  },
  imageText: {
    width: '100%',
    'text-align': 'left',
    color: '#ffffff',
    fontSize: '20px',
  },
  imageTitleText: {
    'font-size': '40px',
    width: '100%',
    'text-align': 'left',
    color: '#ffffff',
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
  const classes = useStyles();

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
      <div className={classes.bgImageContainer}>
        <img src={coverImageURL} alt={title} className={classes.bgImage} />
        <div className={classes.bgShade} />
        <div className={classes.heroTextContainer}>
          <Typography className={classes.imageText}>
            Currently reading:
          </Typography>
          <Typography className={classes.imageTitleText}>{title}</Typography>
          {authorDateString && (
            <Typography className={classes.imageText}>
              {authorDateString}
            </Typography>
          )}
          {genres && (
            <Typography className={classes.imageText}>
              {genres.join(', ')}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
