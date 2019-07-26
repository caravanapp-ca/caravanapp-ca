import React from 'react';
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
  Tooltip,
  Button,
} from '@material-ui/core';
import {
  usePickerState,
  Calendar,
  MaterialUiPickersDate,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import { DateRange, NotInterested } from '@material-ui/icons';
import { addDays, isWithinInterval, isSameDay, format } from 'date-fns';
import clsx from 'clsx';
import CalendarLegend from './CalendarLegend';
import { successTheme, textSecondaryTheme } from '../../../theme';
import {
  ClubReadingSchedule,
  FilterAutoMongoKeys,
  ShelfEntry,
  LoadableMemberStatus,
} from '@caravan/buddy-reading-types';
import { MuiThemeProvider } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    dayWrapper: {
      position: 'relative',
    },
    day: {
      width: 36,
      height: 36,
      // This aligns the days with the day of week headers, but makes the highlight circles stretched
      // margin: "0 2px",
      fontSize: theme.typography.caption.fontSize,
      color: 'inherit',
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
    discussionHighlight: {
      extend: 'highlight',
      background: theme.palette.secondary.main,
      color: theme.palette.text.primary,
      borderRadius: '50%',
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
    discussionLabelContainer: {
      display: 'flex',
      flexDirection: 'column',
    },
    root: {},
    disabled: {
      color: theme.palette.text.primary,
      borderColor: theme.palette.primary.main,
    },
    notchedOutline: {
      disabled: {
        borderColor: theme.palette.grey[400] + ' !important',
      },
    },
    disabledLabel: {
      color: theme.palette.primary.main + ' !important',
    },
    legendContainer: {
      width: '100%',
      marginBottom: 8,
    },
    calendarContainer: {
      position: 'relative',
    },
  })
);

interface ScheduleViewProps {
  currBook: ShelfEntry | null;
  initSchedule: () => void;
  isEditing: boolean;
  onUpdateSchedule: (
    field: 'startDate' | 'duration' | 'discussionFrequency' | 'label',
    newVal: Date | number | string | null,
    index?: number
  ) => void;
  madeScheduleChanges: boolean;
  memberStatus: LoadableMemberStatus;
  schedule:
    | ClubReadingSchedule
    | FilterAutoMongoKeys<ClubReadingSchedule>
    | null;
  setIsEditing: (isEditing: boolean) => void;
}

const discussionLabelMax = 50;

export default function ScheduleView(props: ScheduleViewProps) {
  const theme = useTheme();
  const classes = useStyles();
  const {
    currBook,
    initSchedule,
    isEditing,
    madeScheduleChanges,
    memberStatus,
    onUpdateSchedule,
    schedule,
    setIsEditing,
  } = props;
  const [discussionLabelsFocused, setDiscussionLabelsFocused] = React.useState<
    boolean[]
  >(schedule ? new Array(schedule.discussions.length).fill(false) : []);

  // Placed this here because I was getting the error:
  // React Hook "usePickerState" is called conditionally. React Hooks must be called in the exact same order in every component render. Did you accidentally call a React Hook after an early return?
  const { pickerProps, wrapperProps, inputProps } = usePickerState(
    {
      value: props.schedule ? props.schedule.startDate : null,
      onChange: date => handleScheduleChange('startDate', date),
      autoOk: isEditing ? true : false,
    },
    {
      getDefaultFormat: () => 'MM/dd/yyyy',
    }
  );

  if (!schedule && isEditing) {
    initSchedule();
    return <div />;
  }

  if (!currBook) {
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
          The club needs to pick a book before setting a schedule.
        </Typography>
      </Container>
    );
  }

  // Using the destructured version here causes a Typescript error.
  if (!props.schedule) {
    if (memberStatus === 'owner') {
      return (
        <Container maxWidth="md">
          <div
            style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              style={{
                marginTop: theme.spacing(4),
                marginBottom: theme.spacing(4),
              }}
              onClick={() => setIsEditing(true)}
            >
              <DateRange style={{ marginRight: 8 }} />
              <Typography variant="button">Create a Schedule</Typography>
            </Button>
          </div>
        </Container>
      );
    } else {
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
            {`The club has not yet set a schedule for "${currBook.title}"`}
          </Typography>
        </Container>
      );
    }
  }

  const {
    startDate,
    duration,
    discussionFrequency,
    discussions,
  } = props.schedule;

  const renderDay = (
    day: MaterialUiPickersDate,
    selectedDate: MaterialUiPickersDate,
    dayInCurrentMonth: boolean
  ) => {
    // Shouldn't happen under any normal circumstances.
    if (!day) {
      return <div />;
    }

    if (!startDate) {
      return (
        <div>
          <IconButton
            className={clsx(classes.day, {
              [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
            })}
          >
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
    const discussionIndex = discussions.findIndex(d => isSameDay(d.date, day));
    const isDiscussionDay = discussionIndex >= 0;

    const wrapperClassName = clsx({
      [classes.firstHighlight]: isFirstDay,
      [classes.endHighlight]: isLastDay,
      [classes.highlight]: dayIsBetween,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDay]: !dayInCurrentMonth && dayIsBetween,
      [classes.discussionNonCurrentMonthDay]:
        !dayInCurrentMonth && isDiscussionDay,
    });

    if (isFirstDay || isLastDay || discussionIndex >= 0) {
      let tooltipMsg: string = '';
      if (isFirstDay) {
        tooltipMsg = `Start: ${format(day, 'PPP')}`;
      } else if (isLastDay) {
        tooltipMsg = `End: ${format(day, 'PPP')}`;
      }
      if (discussionIndex >= 0) {
        if (tooltipMsg.length > 0) {
          tooltipMsg += ' - ';
        }
        if (discussions[discussionIndex].label.length > 0) {
          tooltipMsg += `Discussion ${discussionIndex + 1}: ${
            discussions[discussionIndex].label
          }`;
        } else {
          tooltipMsg += `Discussion ${discussionIndex + 1}`;
        }
      }
      return (
        <Tooltip title={tooltipMsg}>
          <div className={wrapperClassName}>
            <div
              className={
                discussionIndex >= 0 ? classes.discussionHighlight : undefined
              }
            >
              <IconButton className={dayClassName}>
                <span> {format(day, 'd')} </span>
              </IconButton>
            </div>
          </div>
        </Tooltip>
      );
    } else {
      return (
        <div className={wrapperClassName}>
          <IconButton className={dayClassName}>
            <span> {format(day, 'd')} </span>
          </IconButton>
        </div>
      );
    }
  };

  const handleScheduleChange = (
    field: 'startDate' | 'duration' | 'discussionFrequency' | 'label',
    newVal: Date | number | string | null,
    index?: number
  ) => {
    onUpdateSchedule(field, newVal, index);
  };

  const onBlurFocusDiscussionLabel = (
    action: 'blur' | 'focus',
    index: number
  ) => {
    let discussionLabelsFocusedNew = [...discussionLabelsFocused];
    discussionLabelsFocusedNew[index] = action === 'blur' ? false : true;
    setDiscussionLabelsFocused(discussionLabelsFocusedNew);
  };

  if (isEditing) {
    return (
      <Container maxWidth="sm">
        <div className={classes.sectionContainer}>
          <Typography variant="h5">
            {`Set a reading schedule for "${currBook.title}"`}
          </Typography>
        </div>
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
                Array.isArray(value) ? value[0] : value
              )
            }
            step={1}
            marks
            min={1}
            max={6}
            defaultValue={duration || undefined}
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
                Array.isArray(value)
                  ? value[0] === 0
                    ? null
                    : value[0]
                  : value === 0
                  ? null
                  : value
              )
            }
            step={1}
            marks
            min={0}
            max={7}
            defaultValue={discussionFrequency || undefined}
          />
        </div>
        <div
          className={clsx(classes.sectionContainer, classes.calendarContainer)}
        >
          <Paper style={{ overflow: 'hidden' }}>
            <Calendar {...pickerProps} renderDay={renderDay} />
            <div className={classes.legendContainer}>
              <CalendarLegend />
            </div>
          </Paper>
          {madeScheduleChanges && (
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <MuiThemeProvider theme={textSecondaryTheme}>
                <Button
                  color="primary"
                  onClick={initSchedule}
                  style={{ marginTop: 8 }}
                >
                  <NotInterested style={{ marginRight: 8 }} />
                  <Typography variant="button">Clear Schedule</Typography>
                </Button>
              </MuiThemeProvider>
            </div>
          )}
        </div>
        {discussions.length > 0 && (
          <div className={classes.sectionContainer}>
            <Typography id="discussion-labels" variant="h6" gutterBottom>
              Discussion Topics
            </Typography>
            <div className={classes.discussionLabelContainer}>
              {discussions.map((d, index) => (
                <TextField
                  id={`discussion-${index + 1}`}
                  label={`Discussion ${index + 1} - ${format(d.date, 'PPP')}`}
                  placeholder={`Chapters ${3 * index + 1}-${3 * (index + 1)}`}
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
                    handleScheduleChange('label', e.target.value, index)
                  }
                  margin="normal"
                  variant="outlined"
                  fullWidth
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    );
  } else {
    return (
      <Container maxWidth="sm">
        <div
          className={clsx(classes.sectionContainer, classes.calendarContainer)}
        >
          <Typography variant="h6" gutterBottom>
            {`Reading Schedule for "${currBook.title}"`}
          </Typography>
          <Paper style={{ overflow: 'hidden' }}>
            <Calendar {...pickerProps} renderDay={renderDay} />
            <div className={classes.legendContainer}>
              <CalendarLegend />
            </div>
          </Paper>
        </div>
        <div className={classes.sectionContainer}>
          <Typography id="discussion-freq-slider-label" variant="h6">
            Start Date
          </Typography>
          <Typography
            color="textSecondary"
            style={{ fontStyle: 'italic' }}
            gutterBottom
          >
            {startDate ? format(startDate, 'PPP') : 'No start date set.'}
          </Typography>
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
              : 'No duration set.'}
          </Typography>
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
              : 'No scheduled discussions.'}
          </Typography>
        </div>
        {discussions.length > 0 && (
          <div className={classes.sectionContainer}>
            <Typography id="discussion-labels" variant="h6" gutterBottom>
              Discussion Topics
            </Typography>
            <div className={classes.discussionLabelContainer}>
              {discussions.map((d, index) => {
                return (
                  <TextField
                    disabled={true}
                    InputProps={{
                      classes: {
                        root: classes.root,
                        disabled: classes.disabled,
                        notchedOutline: classes.notchedOutline,
                      },
                    }}
                    InputLabelProps={{
                      classes: {
                        disabled: classes.disabledLabel,
                      },
                    }}
                    id={`discussion-${index + 1}`}
                    label={`Discussion ${index + 1}: ${format(d.date, 'PPP')}`}
                    placeholder={`Chapters ${3 * index + 1}-${3 * (index + 1)}`}
                    //eslint-disable-next-line react/jsx-no-duplicate-props
                    inputProps={{ maxLength: discussionLabelMax }}
                    onFocus={() => onBlurFocusDiscussionLabel('focus', index)}
                    onBlur={() => onBlurFocusDiscussionLabel('blur', index)}
                    // error={}
                    helperText={
                      discussionLabelsFocused[index]
                        ? `${discussionLabelMax -
                            d.label.length} chars remaining`
                        : ' '
                    }
                    className={classes.textField}
                    value={d.label}
                    onChange={e =>
                      handleScheduleChange('label', e.target.value, index)
                    }
                    margin="normal"
                    variant="outlined"
                    fullWidth
                  />
                );
              })}
            </div>
          </div>
        )}
      </Container>
    );
  }
}
