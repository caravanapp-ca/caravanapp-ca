import React from 'react';

import {
  createStyles,
  makeStyles,
  Switch,
  Typography,
} from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    switchLabel: {
      fontStyle: 'italic',
    },
  })
);

interface SendClubInvitesSwitchProps {
  sendInvites: boolean;
  onChange: (unlistedValue: boolean) => void;
}

export default function SendClubInvitesSwitch(
  props: SendClubInvitesSwitchProps
) {
  const classes = useStyles();
  const { sendInvites, onChange } = props;

  const labelText = sendInvites
    ? 'Everyone who liked the shelf and the shelf creator will be sent an invite link'
    : 'No invites will be sent';

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
