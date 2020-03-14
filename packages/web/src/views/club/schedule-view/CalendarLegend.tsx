import clsx from 'clsx';
import React from 'react';

import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';

import { successTheme } from '../../../theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
    },
    legendItemContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    legendItemContainerMid: {
      marginLeft: 16,
    },
    legendCircle: {
      display: 'block',
      width: 12,
      height: 12,
      borderRadius: '50%',
    },
    startDay: {
      backgroundColor: successTheme.palette.primary.main,
    },
    readingDay: {
      backgroundColor: theme.palette.primary.main,
    },
    discussionDay: {
      backgroundColor: theme.palette.secondary.main,
    },
    endDay: {
      backgroundColor: theme.palette.error.main,
    },
    labelText: {
      marginLeft: 4,
    },
  })
);

export default function CalendarLegend() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <div className={classes.legendItemContainer}>
        <Box
          className={clsx(classes.legendCircle, classes.startDay)}
          boxShadow={2}
        />
        <Typography variant="body2" className={classes.labelText}>
          Start date
        </Typography>
      </div>
      <div
        className={clsx(
          classes.legendItemContainer,
          classes.legendItemContainerMid
        )}
      >
        <Box
          className={clsx(classes.legendCircle, classes.endDay)}
          boxShadow={2}
        />
        <Typography variant="body2" className={classes.labelText}>
          Finish date
        </Typography>
      </div>
      <div
        className={clsx(
          classes.legendItemContainer,
          classes.legendItemContainerMid
        )}
      >
        <Box
          className={clsx(classes.legendCircle, classes.readingDay)}
          boxShadow={2}
        />
        <Typography variant="body2" className={classes.labelText}>
          Reading day
        </Typography>
      </div>
      <div
        className={clsx(
          classes.legendItemContainer,
          classes.legendItemContainerMid
        )}
      >
        <Box
          className={clsx(classes.legendCircle, classes.discussionDay)}
          boxShadow={2}
        />
        <Typography variant="body2" className={classes.labelText}>
          Discussion day
        </Typography>
      </div>
    </div>
  );
}
