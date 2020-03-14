import React from 'react';

import { Chip, createStyles, makeStyles, Theme } from '@material-ui/core';
import { Favorite } from '@material-ui/icons';

import hexToRgb from '../common/hexToRGB';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    baseChip: {
      marginRight: theme.spacing(1),
      marginTop: theme.spacing(1),
      zIndex: 1,
    },
    chipIcon: {
      color: '#AF0020',
      paddingLeft: 2,
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
      icon={common ? <Favorite /> : undefined}
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
