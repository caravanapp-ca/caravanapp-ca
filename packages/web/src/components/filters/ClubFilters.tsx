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
    marginRight: 4,
    'text-transform': 'none',
    borderColor: '#bbdefb',
  },
  genreFilterText: {
    padding: 4,
  },
  speedFilter: {
    'text-transform': 'none',
    marginRight: 4,
    borderColor: '#b2dfdb',
  },
  speedFilterText: {
    padding: 4,
  },
  capacityFilter: {
    'text-transform': 'none',
    marginRight: 4,
    borderColor: '#dcedc8',
  },
  capacityFilterText: {
    padding: 4,
  },
  memberFilter: {
    'text-transform': 'none',
    marginRight: 0,
    borderColor: '#dcedc8',
  },
  memberFilterText: {
    padding: 4,
  },
}));

interface ClubFiltersProps {
  onClickGenreFilter: () => void;
  onClickSpeedFilter: () => void;
  onClickCapacityFilter: () => void;
  onClickMembershipFilter: () => void;
  genreFilterApplied: boolean;
  readingSpeedFilterApplied: boolean;
  capacityFilterApplied: boolean;
  memberFilterApplied: boolean;
}

export default function ClubFilters(props: ClubFiltersProps) {
  const classes = useStyles();

  const {
    onClickGenreFilter,
    onClickSpeedFilter,
    genreFilterApplied,
    readingSpeedFilterApplied,
    onClickCapacityFilter,
    onClickMembershipFilter,
    capacityFilterApplied,
    memberFilterApplied,
  } = props;

  const theme = useTheme();
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Grid container spacing={4}>
      <div className={classes.root}>
        <Button
          classes={{ root: classes.genreFilter, text: classes.genreFilterText }}
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
          classes={{ root: classes.speedFilter, text: classes.speedFilterText }}
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
            Speed
          </Typography>
        </Button>
        <Button
          classes={{
            root: classes.capacityFilter,
            text: classes.capacityFilterText,
          }}
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
        <Button
          classes={{
            root: classes.memberFilter,
            text: classes.memberFilterText,
          }}
          onClick={() => onClickMembershipFilter()}
        >
          <MuiThemeProvider theme={textSecondaryTheme}>
            <ArrowDropDown color="primary" />
          </MuiThemeProvider>
          <Typography
            style={{
              fontSize: screenSmallerThanSm ? 13 : 18,
              fontWeight: 600,
              fontStyle: memberFilterApplied ? 'italic' : undefined,
            }}
            color={memberFilterApplied ? 'textPrimary' : 'textSecondary'}
          >
            Member
          </Typography>
        </Button>
      </div>
    </Grid>
  );
}
