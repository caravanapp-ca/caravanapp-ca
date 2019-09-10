import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { Grid, TextField, Typography, Slider } from '@material-ui/core';
import StartAvatar from '../../components/misc-avatars-icons-labels/avatars/StartAvatar';
import EndAvatar from '../../components/misc-avatars-icons-labels/avatars/EndAvatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 300,
    },
    margin: {
      height: theme.spacing(3),
    },
    updateTypeDiv: {
      display: 'flex',
      flexDirection: 'column',
    },
    avatars: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: 'red',
    },
    slider: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-around',
      backgroundColor: 'blue',
    },
  })
);

const marks = [
  {
    value: 0,
    //label: 'Start',
  },
  {
    value: 50,
    //label: 'Chapter',
  },
  {
    value: 100,
    //label: 'End',
  },
];

function valuetext(value: number) {
  return `${value}°C`;
}

function valueLabelFormat(value: number) {
  return marks.findIndex(mark => mark.value === value) + 1;
}

export default function ProgressUpdateSlider() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.margin} />
      <Typography variant="h6" gutterBottom>
        Pick your point in the book *
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <StartAvatar />
        </Grid>
        <Grid item xs>
          <Slider
            defaultValue={0}
            valueLabelFormat={valueLabelFormat}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider-restrict"
            step={null}
            valueLabelDisplay="auto"
            marks={marks}
          />
        </Grid>
        <Grid item>
          <EndAvatar />
        </Grid>
      </Grid>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="caption">Start</Typography>
        <Typography variant="caption">Chapter</Typography>
        <Typography variant="caption">End</Typography>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TextField id="standard-name" margin="normal" />
      </div>
    </div>
  );
}
