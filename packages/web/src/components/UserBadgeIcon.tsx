import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles, Tooltip } from '@material-ui/core';
import { UserBadge } from '@caravan/buddy-reading-types';

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
  const { key, name, description } = badge;
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
