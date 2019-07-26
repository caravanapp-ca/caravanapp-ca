import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles, Tooltip } from '@material-ui/core';
import { Badge } from '@caravan/buddy-reading-types';

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
  badge: Badge;
}

export default function UserBadgeSmall(props: UserBadgeSmallProps) {
  const classes = useStyles();
  const { badge } = props;
  const { key, name, description, timestamp } = badge;
  const [badgeImg, setBadgeImg] = React.useState<string>();
  useEffect(() => {
    import(`../resources/${key}.svg`).then(img => setBadgeImg(img));
  }, []);
  return (
    <Tooltip title={description}>
      <img src={badgeImg} alt={name} className={classes.referralBadge} />
    </Tooltip>
  );
}
