import React from 'react';
import { makeStyles, createStyles, Theme, Chip } from '@material-ui/core';
import HeartIcon from '@material-ui/icons/Favorite';
import hexToRgb from '../functions/hexToRGB';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    baseChip: {
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(1),
      zIndex: 1,
    },
    chipIcon: {
      color: '#AF0020',
      marginLeft: 2,
      height: 20,
      width: 20,
    },
  })
);

interface GenresInCommonChipsProps {
  name: string;
  backgroundColor: string;
  common: boolean;
}

export default function GenresInCommonChips(props: GenresInCommonChipsProps) {
  const classes = useStyles();
  const { name, backgroundColor, common } = props;

  let backgroundColorWithOpacity = backgroundColor;
  const rgbValue = hexToRgb(backgroundColor);
  if (rgbValue) {
    backgroundColorWithOpacity =
      'rgba(' + rgbValue.r + ', ' + rgbValue.g + ', ' + rgbValue.b + ', 0.1)';
  }

  return (
    <Chip
      label={name}
      key={name}
      icon={common ? <HeartIcon /> : undefined}
      classes={{
        root: classes.baseChip,
        icon: classes.chipIcon,
      }}
      style={{
        backgroundColor: backgroundColorWithOpacity,
      }}
    />
  );
}
