import React from 'react';
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

const useStyles = makeStyles(() => ({
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
    borderColor: '#dcedc8',
  },
  memberFilterText: {
    padding: 4,
  },
  dropDownIcon: {
    height: 20,
    width: 20,
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

  return (
    <div className={classes.root}>
      <Button
        classes={{ root: classes.genreFilter, text: classes.genreFilterText }}
        onClick={() => onClickGenreFilter()}
      >
        <MuiThemeProvider theme={textSecondaryTheme}>
          <ArrowDropDown color="primary" className={classes.dropDownIcon} />
        </MuiThemeProvider>
        <Typography
          style={{
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
          <ArrowDropDown color="primary" className={classes.dropDownIcon} />
        </MuiThemeProvider>
        <Typography
          style={{
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
          <ArrowDropDown color="primary" className={classes.dropDownIcon} />
        </MuiThemeProvider>
        <Typography
          style={{
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
          <ArrowDropDown color="primary" className={classes.dropDownIcon} />
        </MuiThemeProvider>
        <Typography
          style={{
            fontStyle: memberFilterApplied ? 'italic' : undefined,
          }}
          color={memberFilterApplied ? 'textPrimary' : 'textSecondary'}
        >
          Member
        </Typography>
      </Button>
    </div>
  );
}
