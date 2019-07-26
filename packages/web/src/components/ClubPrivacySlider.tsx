import React from 'react';
import {
  makeStyles,
  createStyles,
  Typography,
  useTheme,
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(theme =>
  createStyles({
    switchLabel: {
      fontStyle: 'italic',
    },
  })
);

interface ClubPrivacySliderProps {
  unlisted: boolean;
  onChange: (unlistedValue: boolean) => void;
}

export default function ClubPrivacySlider(props: ClubPrivacySliderProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { unlisted, onChange } = props;

  let labelText = unlisted
    ? 'Only people you send the link to can join'
    : 'Anyone can join via the homepage';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography>Unlisted</Typography>
        <Switch
          checked={!unlisted}
          onChange={() => onChange(!unlisted)}
          value={unlisted}
          color="primary"
          inputProps={{ 'aria-label': 'club privacy checkbox' }}
        />
        <Typography>Public</Typography>
      </div>
      <Typography color="textSecondary" className={classes.switchLabel}>
        {labelText}
      </Typography>
    </div>
  );
}
