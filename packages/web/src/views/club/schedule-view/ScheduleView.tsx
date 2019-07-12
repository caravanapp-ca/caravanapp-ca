import React, { useState } from 'react';
import {
  Paper,
  Theme,
  createStyles,
  useTheme,
  IconButton,
  Typography,
  Slider,
  Container,
} from '@material-ui/core';
import {
  usePickerState,
  Calendar,
  MaterialUiPickersDate,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import { addDays, isWithinInterval, isSameDay, format } from 'date-fns';
import clsx from 'clsx';
import { eachDayOfInterval } from 'date-fns/esm';
import CalendarLegend from './CalendarLegend';
import { successTheme } from '../../../theme';
import {
  ClubReadingSchedule,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dayWrapper: {
      position: 'relative',
    },
    day: {
      width: 36,
      height: 36,
      fontSize: theme.typography.caption.fontSize,
      margin: '0 2px',
      color: 'inherit',
    },
    customDayHighlight: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: '2px',
      right: '2px',
      border: `1px solid ${theme.palette.secondary.main}`,
      borderRadius: '50%',
    },
    nonCurrentMonthDay: {
      color: theme.palette.text.disabled,
    },
    highlightNonCurrentMonthDay: {
      color: theme.palette.common.white,
    },
    discussionNonCurrentMonthDay: {
      color: theme.palette.text.primary,
    },
    highlight: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    firstHighlight: {
      extend: 'highlight',
      background: successTheme.palette.primary.main,
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    },
    endHighlight: {
      extend: 'highlight',
      background: theme.palette.error.main,
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    },
    discussionHighlight: {
      extend: 'highlight',
      background: theme.palette.secondary.main,
      color: theme.palette.text.primary,
    },
    sectionContainer: {
      marginTop: theme.spacing(4),
    },
  })
);

interface ScheduleViewProps {
  initSchedule: () => void;
  isEditing: boolean;
  onUpdateSchedule: (
    field: 'startDate' | 'duration' | 'discussionFrequency',
    newVal: Date | number | null
  ) => void;
  schedule:
    | ClubReadingSchedule
    | FilterAutoMongoKeys<ClubReadingSchedule>
    | null;
}

export default function ScheduleView(props: ScheduleViewProps) {
  const theme = useTheme();
  const classes = useStyles();
  const { initSchedule, isEditing, schedule } = props;

  // Placed this here because I was getting the error:
  // React Hook "usePickerState" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  const { pickerProps, wrapperProps, inputProps } = usePickerState(
    {
      value: props.schedule ? props.schedule.startDate : null,
      onChange: date => handleScheduleChange('startDate', date),
    },
    {
      getDefaultFormat: () => 'MM/dd/yyyy',
    }
  );

  if (!schedule && isEditing) {
    initSchedule();
    return <div />;
  }

  // Using the destructured version here causes a Typescript error.
  if (!props.schedule) {
    return (
      <Container maxWidth="md">
        <Typography
          color="textSecondary"
          style={{
            textAlign: 'center',
            fontStyle: 'italic',
            marginTop: theme.spacing(4),
            marginBottom: theme.spacing(4),
          }}
        >
          This club has not yet set a schedule.
        </Typography>
      </Container>
    );
  }

  const { onUpdateSchedule } = props;
  const { startDate, duration, discussionFrequency } = props.schedule;
  // const [startDate, handleScheduleChange] = useState<Date | null>(
  //   addDays(new Date(), 3)
  // );
  // const [duration, setDuration] = useState<number | null>(3);
  // const [discussionFrequency, setDiscussionFreq] = useState<number | null>(3);

  let interval: Date[] = [];
  let discussionDays: Date[] = [];
  if (startDate && duration && discussionFrequency) {
    const durationInDays = duration * 7;
    const readingDays = eachDayOfInterval({
      start: startDate,
      end: addDays(startDate, durationInDays),
    });
    for (
      let i = discussionFrequency - 1;
      i < readingDays.length;
      i = i + discussionFrequency
    ) {
      discussionDays.push(readingDays[i]);
    }
  }

  const renderDay = (
    day: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean
  ) => {
    // Shouldn't happen under any normal circumstances.
    if (!day) {
      return <div />;
    }

    // TODO: Will need to break these out.
    if (!startDate || !duration || !discussionFrequency) {
      return (
        <div>
          <IconButton className={classes.day}>
            <span> {format(day, 'd')} </span>
          </IconButton>
        </div>
      );
    }

    const durationInDays = duration * 7;
    const end = addDays(startDate, durationInDays);

    const dayIsBetween = isWithinInterval(day, {
      start: addDays(startDate, -1),
      end,
    });
    const isFirstDay = isSameDay(day, startDate);
    const isLastDay = isSameDay(day, end);
    const isDiscussionDay = discussionDays.some(d => isSameDay(d, day));

    const wrapperClassName = clsx({
      [classes.highlight]: dayIsBetween,
      [classes.discussionHighlight]: isDiscussionDay,
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
      [classes.discussionNonCurrentMonthDay]:
        !dayInCurrentMonth && isDiscussionDay,
    });

    return (
      <div className={wrapperClassName}>
        <IconButton className={dayClassName}>
          <span> {format(day, 'd')} </span>
        </IconButton>
      </div>
    );
  };

  const handleScheduleChange = (
    field: 'startDate' | 'duration' | 'discussionFrequency',
    newVal: Date | number | null
  ) => {
    onUpdateSchedule(field, newVal);
  };

  return (
    <Container maxWidth="sm">
      <div className={classes.sectionContainer}>
        <Typography id="discussion-freq-slider-label" variant="h6">
          Club Calendar Legend
        </Typography>
        <Paper>
          <CalendarLegend />
        </Paper>
      </div>
      <div className={classes.sectionContainer}>
        <Typography id="discussion-freq-slider-label" variant="h6">
          Start Date
        </Typography>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          style={{ fontStyle: 'italic' }}
          gutterBottom
        >
          Click a date on the calendar to set your start date!
        </Typography>
        <Paper style={{ overflow: 'hidden' }}>
          <Calendar
            {...pickerProps}
            onChange={date => handleScheduleChange('startDate', date)}
            renderDay={renderDay}
          />
        </Paper>
      </div>
      <div className={classes.sectionContainer}>
        <Typography id="discussion-freq-slider-label" variant="h6">
          Duration
        </Typography>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          style={{ fontStyle: 'italic' }}
          gutterBottom
        >
          {duration
            ? duration > 1
              ? `Finish in ${duration} weeks`
              : 'Finish in 1 week'
            : 'No duration set'}
        </Typography>
        <Slider
          defaultValue={3}
          getAriaValueText={duration =>
            duration ? duration.toString() : 'none'
          }
          aria-labelledby="discussion-freq-slider"
          valueLabelDisplay="auto"
          onChange={(event, value) =>
            handleScheduleChange(
              'duration',
              Array.isArray(value) ? value[0] : value
            )
          }
          step={1}
          marks
          min={1}
          max={6}
        />
      </div>
      <div className={classes.sectionContainer}>
        <Typography id="discussion-freq-slider-label" variant="h6">
          Discussion Frequency
        </Typography>
        <Typography
          variant="subtitle2"
          color="textSecondary"
          style={{ fontStyle: 'italic' }}
          gutterBottom
        >
          {discussionFrequency
            ? discussionFrequency > 1
              ? `Discuss every ${discussionFrequency} days`
              : 'Discuss every day'
            : 'No scheduled discussions'}
        </Typography>
        <Slider
          defaultValue={3}
          getAriaValueText={discussionFrequency =>
            discussionFrequency ? discussionFrequency.toString() : 'none'
          }
          aria-labelledby="discussion-freq-slider"
          valueLabelDisplay="auto"
          onChange={(event, value) =>
            handleScheduleChange(
              'discussionFrequency',
              Array.isArray(value) ? value[0] : value
            )
          }
          step={1}
          marks
          min={1}
          max={7}
        />
      </div>
    </Container>
  );
}
