import React from 'react';

import { UserBadge } from '@caravanapp/types';
import { createStyles, makeStyles, Theme, Tooltip } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    referralBadge: {
      resizeMode: 'contain',
      margin: theme.spacing(1),
    },
  })
);

interface UserBadgeIconProps {
  badge: UserBadge;
  size?: number;
}

export default function UserBadgeIcon(props: UserBadgeIconProps) {
  const classes = useStyles();
  const { badge, size } = props;
  const { key, name } = badge;
  return (
    <Tooltip title={name}>
      <img
        src={require(`../resources/badges/${key}.svg`)}
        alt={name}
        className={classes.referralBadge}
        style={{ height: size || 36 }}
      />
    </Tooltip>
  );
}
