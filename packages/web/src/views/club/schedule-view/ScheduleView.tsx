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
  TextField,
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
  Discussion,
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
      // margin: '0 2px',
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
    discussionHighlight: {
      extend: 'highlight',
      background: theme.palette.secondary.main,
      color: theme.palette.text.primary,
    },
    firstHighlight: {
      extend: 'highlight',
      background: successTheme.palette.primary.main,
      color: theme.palette.common.white,
      borderTopLeftRadius: '50%',
      borderBottomLeftRadius: '50%',
    },
    endHighlight: {
      extend: 'highlight',
      background: theme.palette.error.main,
      color: theme.palette.common.white,
      borderTopRightRadius: '50%',
      borderBottomRightRadius: '50%',
    },
    firstOnlyHighlight: {
      extend: 'highlight',
      background: successTheme.palette.primary.main,
      borderRadius: '50%',
    },
    sectionContainer: {
      marginTop: theme.spacing(4),
    },
    textField: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

interface ScheduleViewProps {
  initSchedule: () => void;
  isEditing: boolean;
  onUpdateSchedule: (
    field: 'startDate' | 'duration' | 'discussionFrequency' | 'label',
    newVal: Date | number | string | null,
    newDiscussions?: Discussion[],
    index?: number
  ) => void;
  schedule:
    | ClubReadingSchedule
    | FilterAutoMongoKeys<ClubReadingSchedule>
    | null;
}

const discussionLabelMax = 50;

export default function ScheduleView(props: ScheduleViewProps) {
  const theme = useTheme();
  const classes = useStyles();
  const { initSchedule, isEditing, schedule } = props;
  const [discussionLabelsFocused, setDiscussionLabelsFocused] = React.useState<
    boolean[]
  >(schedule ? new Array(schedule.discussions.length).fill(false) : []);

  // Placed this here because I was getting the error:
  // React Hook "usePickerState" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  const { pickerProps, wrapperProps, inputProps } = usePickerState(
    {
      value: props.schedule ? props.schedule.startDate : null,
      onChange: date => handleScheduleChange('startDate', date, discussionObjs),
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
  const {
    startDate,
    duration,
    discussionFrequency,
    discussions,
  } = props.schedule;

  const discussionDays: Date[] = [];
  const discussionObjs: Discussion[] = [];
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
      discussionObjs.push({
        date: readingDays[i],
        label: i < discussions.length ? discussions[i].label : '',
        format: i < discussions.length ? discussions[i].format : 'text',
      });
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
    if (!startDate) {
      return (
        <div>
          <IconButton className={classes.day}>
            <span> {format(day, 'd')} </span>
          </IconButton>
        </div>
      );
    }

    const isFirstDay = isSameDay(day, startDate);

    if (!duration) {
      const wrapperClassName = clsx({
        [classes.firstOnlyHighlight]: isFirstDay,
      });
      return (
        <div className={wrapperClassName}>
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
    const isLastDay = isSameDay(day, end);
    const isDiscussionDay = discussionDays.some(d => isSameDay(d, day));

    const wrapperClassName = clsx({
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
      [classes.highlight]: dayIsBetween,
      [classes.discussionHighlight]: isDiscussionDay,
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
    field: 'startDate' | 'duration' | 'discussionFrequency' | 'label',
    newVal: Date | number | string | null,
    newDiscussions?: Discussion[],
    index?: number
  ) => {
    onUpdateSchedule(field, newVal, newDiscussions, index);
  };

  const onBlurFocusDiscussionLabel = (
    action: 'blur' | 'focus',
    index: number
  ) => {
    let discussionLabelsFocusedNew = [...discussionLabelsFocused];
    discussionLabelsFocusedNew[index] = action === 'blur' ? false : true;
    setDiscussionLabelsFocused(discussionLabelsFocusedNew);
  };

  return (
    <Container maxWidth="sm">
      <div className={classes.sectionContainer}>
        <Typography id="discussion-freq-slider-label" variant="h6">
          Start Date
        </Typography>
        <Typography color="textSecondary" style={{ fontStyle: 'italic' }}>
          {startDate
            ? format(startDate, 'PPP')
            : 'Click a date on the calendar to set your start date!'}
        </Typography>
      </div>
      <div className={classes.sectionContainer}>
        <Typography id="discussion-freq-slider-label" variant="h6">
          Duration
        </Typography>
        <Typography
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
          getAriaValueText={duration =>
            duration ? duration.toString() : 'none'
          }
          aria-labelledby="discussion-freq-slider"
          valueLabelDisplay="auto"
          onChange={(event, value) =>
            handleScheduleChange(
              'duration',
              Array.isArray(value) ? value[0] : value,
              discussionObjs
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
          getAriaValueText={discussionFrequency =>
            discussionFrequency ? discussionFrequency.toString() : 'none'
          }
          aria-labelledby="discussion-freq-slider"
          valueLabelDisplay="auto"
          onChange={(event, value) =>
            handleScheduleChange(
              'discussionFrequency',
              Array.isArray(value) ? value[0] : value,
              discussionObjs
            )
          }
          step={1}
          marks
          min={1}
          max={7}
        />
      </div>
      <div className={classes.sectionContainer}>
        <Paper style={{ overflow: 'hidden' }}>
          <Calendar
            {...pickerProps}
            onChange={date =>
              handleScheduleChange('startDate', date, discussionObjs)
            }
            renderDay={renderDay}
          />
        </Paper>
      </div>
      <div className={classes.sectionContainer}>
        <Typography id="discussion-freq-slider-label" variant="h6">
          Club Calendar Legend
        </Typography>
        <Paper>
          <CalendarLegend />
        </Paper>
      </div>
      {discussions.length > 0 && (
        <div className={classes.sectionContainer}>
          <Typography id="discussion-labels" variant="h6">
            Discussion Labels
          </Typography>
          {discussions.map((d, index) => (
            <TextField
              id={`discussion-${index + 1}`}
              label={`Discussion ${index + 1}`}
              inputProps={{ maxLength: discussionLabelMax }}
              onFocus={() => onBlurFocusDiscussionLabel('focus', index)}
              onBlur={() => onBlurFocusDiscussionLabel('blur', index)}
              // error={}
              helperText={
                discussionLabelsFocused[index]
                  ? `${discussionLabelMax - d.label.length} chars remaining`
                  : ' '
              }
              className={classes.textField}
              value={d.label}
              onChange={e =>
                handleScheduleChange('label', e.target.value, undefined, index)
              }
              margin="normal"
              variant="outlined"
            />
          ))}
        </div>
      )}
    </Container>
  );
}
