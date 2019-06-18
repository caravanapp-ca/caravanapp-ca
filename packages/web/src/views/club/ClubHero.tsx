import React from 'react';
import { ShelfEntryDoc } from '@caravan/buddy-reading-types';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './ClubHero.css';

const useStyles = makeStyles(theme => ({}));

interface ClubHeroProps {
  currBook: ShelfEntryDoc;
}

export default function ClubHero(props: ClubHeroProps) {
  const classes = useStyles();

  const { title, author, publishedDate, genres } = props.currBook;

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
      <div className="bg-image">
        <div className="bg-shade" />
      </div>
      <div className="header-text-container">
        <Typography>Currently Reading</Typography>
        <Typography>{title}</Typography>
        {authorDateString && <Typography>{authorDateString}</Typography>}
        {genres && <Typography>{genres.join(', ')}</Typography>}
      </div>
    </div>
  );
}
