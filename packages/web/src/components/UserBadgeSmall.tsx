import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles, Tooltip } from '@material-ui/core';
import { Badge, UserBadge } from '@caravan/buddy-reading-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    referralBadge: {
      height: 36,
      resizeMode: 'contain',
      margin: theme.spacing(1),
    },
  })
);

interface UserBadgeSmallProps {
  badge: UserBadge;
}

export default function UserBadgeSmall(props: UserBadgeSmallProps) {
  const classes = useStyles();
  const { badge } = props;
  const { key, name, description } = badge;
  // const [badgeImg, setBadgeImg] = React.useState<any>();
  // useEffect(() => {
  //   import().then(img => setBadgeImg(img));
  // }, []);
  return (
    <Tooltip title={description}>
      <img
        src={require(`../resources/badges/${key}.svg`)}
        alt={name}
        className={classes.referralBadge}
      />
    </Tooltip>
  );
}
