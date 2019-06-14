import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import './ClubHeader.css';
import { Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({

}));

export default function Club() {
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
