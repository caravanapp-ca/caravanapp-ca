import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles, Typography, Box } from '@material-ui/core';
import { successTheme } from '../../../theme';
import clsx from 'clsx';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexGrow: 1,
      padding: theme.spacing(2),
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    legendItemContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    legendItemContainerMid: {
      marginTop: theme.spacing(1),
    },
    legendCircle: {
      display: 'block',
      width: 24,
      height: 24,
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
      marginLeft: 16,
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
        <Typography className={classes.labelText}>Start date</Typography>
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
        <Typography className={classes.labelText}>Finish date</Typography>
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
        <Typography className={classes.labelText}>Reading day</Typography>
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
        <Typography className={classes.labelText}>Discussion day</Typography>
      </div>
    </div>
  );
}
