import React from 'react';
import { Genres } from '@caravan/buddy-reading-types';
import { makeStyles } from '@material-ui/styles';
import { Button, Typography } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { textSecondaryTheme } from '../../theme';
import { MuiThemeProvider } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
}));

interface ClubFiltersProps {
  // genres: Genres;
  // onGenresSubmit: (genreKeys: string) => void;
}

export default function ClubFilters(props: ClubFiltersProps) {
  const classes = useStyles();
  // const { genres, onGenresSubmit } = props;
  return (
    <div className={classes.root}>
      <Button>
        <MuiThemeProvider theme={textSecondaryTheme}>
          <ArrowDropDown color="primary" />
        </MuiThemeProvider>
        <Typography variant="button" color="textSecondary">
          GENRES
        </Typography>
      </Button>
    </div>
  );
}
