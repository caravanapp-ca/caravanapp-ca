import React from 'react';
import { Button, Typography, MuiThemeProvider, makeStyles } from '@material-ui/core';
import { ArrowDropDown } from '@material-ui/icons';
import { textSecondaryTheme } from '../../theme';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  filterButton: {
    marginRight: 4,
    'text-transform': 'none',
  },
  filterButtonText: {
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

  return (
    <div className={classes.root}>
      {/* TODO: Map a variable number of genre buttons here in the future. */}
      <Button
        classes={{ root: classes.filterButton, text: classes.filterButtonText }}
        onClick={onClickGenreFilter}
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
        classes={{ root: classes.filterButton, text: classes.filterButtonText }}
        onClick={onClickSpeedFilter}
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
        classes={{ root: classes.filterButton, text: classes.filterButtonText }}
        onClick={onClickCapacityFilter}
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
        classes={{ root: classes.filterButton, text: classes.filterButtonText }}
        onClick={onClickMembershipFilter}
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
