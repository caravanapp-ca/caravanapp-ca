import React from 'react';
import { Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import './ClubHero.css';

const useStyles = makeStyles(theme => ({

}));

export default function ClubHero() {
  const classes = useStyles();

  return (
    <div>
      <div className="bg-image">
        <div className="bg-shade">
        </div>
      </div>
      <div className="header-text-container">
        <Typography>Currently Reading</Typography>
        <Typography>The Name of the Wind</Typography>
        <Typography>Patrick Rothfuss, 2007</Typography>
        <Typography>Fantasy</Typography>
      </div>
    </div>
  )
}
