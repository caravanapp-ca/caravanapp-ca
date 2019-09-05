import React from 'react';
import { makeStyles, createStyles, Typography } from '@material-ui/core';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles(() =>
  createStyles({
    switchLabel: {
      fontStyle: 'italic',
    },
  })
);

interface SendClubInvitesSliderProps {
  sendInvites: boolean;
  onChange: (unlistedValue: boolean) => void;
}

export default function SendClubInvitesSlider(
  props: SendClubInvitesSliderProps
) {
  const classes = useStyles();
  const { sendInvites, onChange } = props;

  let labelText = sendInvites
    ? 'Automatically send invites'
    : "Don't send invites";

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
        <Typography>Don't Send Invites</Typography>
        <Switch
          checked={sendInvites}
          onChange={() => onChange(!sendInvites)}
          value={sendInvites}
          color="primary"
          inputProps={{ 'aria-label': 'send invites to your club slider' }}
        />
        <Typography>Send Invites</Typography>
      </div>
      <Typography color="textSecondary" className={classes.switchLabel}>
        {labelText}
      </Typography>
    </div>
  );
}
