import React from 'react';
import { UserSelectedGenre, ReadingSpeed } from '@caravan/buddy-reading-types';
import { makeStyles } from '@material-ui/styles';
import {
  Button,
  Typography,
  useMediaQuery,
  useTheme,
  Grid,
} from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { textSecondaryTheme } from '../../theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import ListElementAvatar from '../ListElementAvatar';
import { readingSpeedIcons } from '../reading-speed-avatars-icons-labels';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  genreFilter: {
    marginRight: 8,
    'text-transform': 'none',
  },
  speedFilter: {
    'text-transform': 'none',
    marginRight: 8,
  },
  capacityFilter: {
    'text-transform': 'none',
  },
}));

interface ClubFiltersProps {
  onClickGenreFilter: () => void;
  onClickSpeedFilter: () => void;
  onClickCapacityFilter: () => void;
  genreFilterApplied: boolean;
  genreModalShown: boolean;
  readingSpeedFilterApplied: boolean;
  readingSpeedModalShown: boolean;
  capacityFilterApplied: boolean;
  capacityModalShown: boolean;
}

export default function ClubFilters(props: ClubFiltersProps) {
  const classes = useStyles();

  const {
    onClickGenreFilter,
    onClickSpeedFilter,
    genreFilterApplied,
    genreModalShown,
    readingSpeedFilterApplied,
    readingSpeedModalShown,
    onClickCapacityFilter,
    capacityFilterApplied,
    capacityModalShown,
  } = props;

  const theme = useTheme();
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Grid container spacing={4}>
      <div className={classes.root}>
        <Button
          className={classes.genreFilter}
          onClick={() => onClickGenreFilter()}
        >
          <MuiThemeProvider theme={textSecondaryTheme}>
            <ArrowDropDown color="primary" />
          </MuiThemeProvider>
          <Typography
            style={{
              fontSize: screenSmallerThanSm ? 13 : 18,
              fontWeight: 600,
              fontStyle: genreFilterApplied ? 'italic' : undefined,
            }}
            color={genreFilterApplied ? 'textPrimary' : 'textSecondary'}
          >
            Genres
          </Typography>
        </Button>
        <Button
          className={classes.speedFilter}
          onClick={() => onClickSpeedFilter()}
        >
          <MuiThemeProvider theme={textSecondaryTheme}>
            <ArrowDropDown color="primary" />
          </MuiThemeProvider>
          <Typography
            style={{
              fontSize: screenSmallerThanSm ? 13 : 18,
              fontWeight: 600,
              fontStyle: readingSpeedFilterApplied ? 'italic' : undefined,
            }}
            color={readingSpeedFilterApplied ? 'textPrimary' : 'textSecondary'}
          >
            Reading Speed
          </Typography>
        </Button>
        <Button
          className={classes.capacityFilter}
          onClick={() => onClickCapacityFilter()}
        >
          <MuiThemeProvider theme={textSecondaryTheme}>
            <ArrowDropDown color="primary" />
          </MuiThemeProvider>
          <Typography
            style={{
              fontSize: screenSmallerThanSm ? 13 : 18,
              fontWeight: 600,
              fontStyle: capacityFilterApplied ? 'italic' : undefined,
            }}
            color={capacityFilterApplied ? 'textPrimary' : 'textSecondary'}
          >
            Capacity
          </Typography>
        </Button>
      </div>
    </Grid>
  );
}
