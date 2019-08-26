import React from 'react';
import {
  Paper,
  Theme,
  createStyles,
  useTheme,
  IconButton,
  Typography,
  Slider,
  Switch,
  Container,
  TextField,
  Tooltip,
  Button,
  PropTypes,
} from '@material-ui/core';
import {
  usePickerState,
  Calendar,
  MaterialUiPickersDate,
} from '@material-ui/pickers';
import { makeStyles } from '@material-ui/styles';
import { DateRange, NotInterested, Settings } from '@material-ui/icons';
import {
  addDays,
  isWithinInterval,
  isSameDay,
  format,
  differenceInCalendarDays,
  isAfter,
  isBefore,
} from 'date-fns';
import clsx from 'clsx';
import CalendarLegend from './CalendarLegend';
import { successTheme, textSecondaryTheme } from '../../../theme';
import {
  ClubReadingSchedule,
  FilterAutoMongoKeys,
  ShelfEntry,
  LoadableMemberStatus,
  Discussion,
} from '@caravan/buddy-reading-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { MIN_SCHEDULE_LENGTH_DAYS } from '../../../common/globalConstants';
import { types } from '@babel/core';
import { DomainPropTypes } from '@material-ui/pickers/constants/prop-types';

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
    highlight: {
      background: theme.palette.primary.main,
      color: theme.palette.common.white,
    },
    highlightNonCurrentMonthDayWrapper: {
      background: theme.palette.primary.light,
    },
    highlightNonCurrentMonthDayFont: {
      color: 'rgba(255, 255, 255, .7)',
    },
    discussionNonCurrentMonthDay: {
      color: theme.palette.text.disabled,
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
    customCalendarButton: {
      display: 'block',
      height: 24,
      width: 24,
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
    },
    selectedCalendarButton: {
      boxShadow: `0px 2px 8px ${theme.palette.primary.main}`,
      border: `2px solid ${theme.palette.primary.main}`,
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
  onCustomUpdateSchedule: (
    newSchedule: ClubReadingSchedule | FilterAutoMongoKeys<ClubReadingSchedule>
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
    onCustomUpdateSchedule,
    schedule,
    setIsEditing,
  } = props;
  const [discussionLabelsFocused, setDiscussionLabelsFocused] = React.useState<
    boolean[]
  >(schedule ? new Array(schedule.discussions.length).fill(false) : []);
  const [customModeEnabled, setCustomModeEnabled] = React.useState<boolean>(
    false
  );
  const [customEditField, setCustomEditField] = React.useState<
    'startDate' | 'endDate' | 'discussionDate'
  >('startDate');
  const [
    currentlySelectedDate,
    setCurrentlySelectedDate,
  ] = React.useState<Date | null>(schedule ? schedule.startDate : null);

  // Placed this here because I was getting the error:
  // React Hooks must be called in the exact same order in every component render.

  const { pickerProps } = usePickerState(
    {
      value: currentlySelectedDate,
      onChange: date => onClickCalendar(date),
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
    _selectedDate: MaterialUiPickersDate,
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

    //If there is no schedule length return all regularly formatted dates
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
      [classes.highlightNonCurrentMonthDayWrapper]:
        !dayInCurrentMonth && dayIsBetween,
    });

    const dayClassName = clsx(classes.day, {
      [classes.nonCurrentMonthDay]: !dayInCurrentMonth,
      [classes.highlightNonCurrentMonthDayFont]:
        !dayInCurrentMonth && dayIsBetween,
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

  const makeValidDiscussionArray = (
    schedule: ClubReadingSchedule | FilterAutoMongoKeys<ClubReadingSchedule>
  ) => {
    const { startDate, duration, discussions } = schedule;
    if (!startDate || !duration || discussions.length === 0) {
      return [];
    }
    const endDate = addDays(startDate, duration * 7);
    const newDiscussions = discussions.filter(
      d => d.date && !isBefore(d.date, startDate) && !isAfter(d.date, endDate)
    );
    return newDiscussions;
  };

  const onClickCalendar = (date: Date | null) => {
    if (!date) {
      return;
    }
    setCurrentlySelectedDate(date);
    if (!customModeEnabled) {
      handleScheduleChange('startDate', date);
      return;
    }
    if (!schedule) {
      return;
    }

    const newSchedule = { ...schedule };

    switch (customEditField) {
      case 'startDate':
        if (!newSchedule.startDate || !newSchedule.duration) {
          newSchedule.startDate = date;
          newSchedule.duration = MIN_SCHEDULE_LENGTH_DAYS / 7;
          break;
        }
        const endDate = addDays(
          newSchedule.startDate,
          newSchedule.duration * 7
        );
        if (
          differenceInCalendarDays(endDate, date) < MIN_SCHEDULE_LENGTH_DAYS
        ) {
          newSchedule.duration = MIN_SCHEDULE_LENGTH_DAYS / 7;
        } else {
          newSchedule.duration = differenceInCalendarDays(endDate, date) / 7;
        }
        newSchedule.startDate = date;
        newSchedule.discussions = makeValidDiscussionArray(newSchedule);
        onCustomUpdateSchedule(newSchedule);
        break;
      case 'discussionDate':
        if (
          !startDate ||
          !duration ||
          isBefore(date, startDate) ||
          isAfter(date, addDays(startDate, duration * 7))
        ) {
          break;
        }
        const matchingDiscussionIndex = newSchedule.discussions.findIndex(d =>
          isSameDay(d.date, date)
        );
        if (matchingDiscussionIndex === -1) {
          //Add new discussion
          const newDiscussion: Discussion = { date, label: '', format: 'text' };
          const newDiscussionIndex = discussions.findIndex(d =>
            isAfter(d.date, date)
          );
          if (newDiscussionIndex === -1) {
            newSchedule.discussions.push(newDiscussion);
          } else {
            newSchedule.discussions.splice(
              newDiscussionIndex,
              0,
              newDiscussion
            );
          }
        } else {
          //Remove old discussion
          newSchedule.discussions.splice(matchingDiscussionIndex, 1);
        }
        newSchedule.discussionFrequency = -1;
        onCustomUpdateSchedule(newSchedule);
        break;
      case 'endDate':
        if (!newSchedule.startDate) {
          newSchedule.startDate = addDays(date, -MIN_SCHEDULE_LENGTH_DAYS);
        }
        let durationInDays = differenceInCalendarDays(
          date,
          newSchedule.startDate
        );
        if (durationInDays < MIN_SCHEDULE_LENGTH_DAYS) {
          newSchedule.startDate = addDays(date, -MIN_SCHEDULE_LENGTH_DAYS);
          durationInDays = MIN_SCHEDULE_LENGTH_DAYS;
        }
        newSchedule.duration = durationInDays / 7;
        newSchedule.discussions = makeValidDiscussionArray(newSchedule);
        onCustomUpdateSchedule(newSchedule);
        break;
    }
  };

  const onBlurFocusDiscussionLabel = (
    action: 'blur' | 'focus',
    index: number
  ) => {
    let discussionLabelsFocusedNew = [...discussionLabelsFocused];
    discussionLabelsFocusedNew[index] = action === 'blur' ? false : true;
    setDiscussionLabelsFocused(discussionLabelsFocusedNew);
  };

  //returns an estimation of the duration of a schedule to the nearest 1/2 week
  const durationEstimationCalculator = (duration: number) => {
    let durationText = '';
    const durationEstimation = Math.round(duration * 2) / 2;
    if (durationEstimation !== duration) {
      durationText = durationText.concat('~');
    }
    durationText = durationText.concat(durationEstimation.toString());
    return durationText;
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
                ? `Finish in ${durationEstimationCalculator(duration)} weeks`
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
            defaultValue={duration ? Math.round(duration) : undefined}
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
            {discussionFrequency && discussions.length !== 0
              ? discussionFrequency > 1
                ? `Discuss every ${discussionFrequency} days`
                : discussionFrequency === -1
                ? 'Custom'
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
            defaultValue={
              discussionFrequency && discussionFrequency >= 0
                ? discussionFrequency
                : undefined
            }
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
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <Switch
                  onChange={() => setCustomModeEnabled(!customModeEnabled)}
                  value={customModeEnabled}
                  color="primary"
                  inputProps={{ 'aria-label': 'custom mode checkbox' }}
                />
                <Typography display="inline">Customize</Typography>
              </div>
              {customModeEnabled && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}
                >
                  <div
                    className={clsx(
                      classes.customCalendarButton,
                      classes.firstHighlight,
                      {
                        [classes.selectedCalendarButton]:
                          customEditField === 'startDate',
                      }
                    )}
                    onClick={() => setCustomEditField('startDate')}
                  />
                  <div
                    className={clsx(
                      classes.customCalendarButton,
                      classes.discussionHighlight,
                      {
                        [classes.selectedCalendarButton]:
                          customEditField === 'discussionDate',
                      }
                    )}
                    style={{ margin: `0px ${theme.spacing(2)}px` }}
                    onClick={() => setCustomEditField('discussionDate')}
                  />

                  <div
                    className={clsx(
                      classes.customCalendarButton,
                      classes.endHighlight,
                      {
                        [classes.selectedCalendarButton]:
                          customEditField === 'endDate',
                      }
                    )}
                    onClick={() => setCustomEditField('endDate')}
                  />
                </div>
              )}
              <div>
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
                  InputProps={{
                    inputProps: { maxLength: discussionLabelMax },
                  }}
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
                ? `Finish in ${durationEstimationCalculator(duration)} weeks`
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
                      inputProps: { maxLength: discussionLabelMax },
                    }}
                    InputLabelProps={{
                      classes: {
                        disabled: classes.disabledLabel,
                      },
                    }}
                    id={`discussion-${index + 1}`}
                    label={`Discussion ${index + 1}: ${format(d.date, 'PPP')}`}
                    placeholder={`Chapters ${3 * index + 1}-${3 * (index + 1)}`}
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
