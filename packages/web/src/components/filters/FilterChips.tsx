import clsx from 'clsx';
import React from 'react';

import { FilterChipType } from '@caravanapp/types';
import { Chip, createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme =>
  createStyles({
    baseChip: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    genreChip: {
      backgroundColor: '#bbdefb',
    },
    speedChip: {
      backgroundColor: '#b2ebf2',
    },
    capacityChip: {
      backgroundColor: '#c8e6c9',
    },
    membershipChip: {
      backgroundColor: '#f0f4c3',
    },
  })
);

interface FilterChipsProps {
  name: string;
  active: boolean;
  type: FilterChipType;
  chipKey: string;
  onRemove: (key: string, type: FilterChipType) => void;
}

export default function FilterChips(props: FilterChipsProps) {
  const classes = useStyles();

  const { name, type, chipKey, onRemove } = props;

  const wrapperClassName = clsx(classes.baseChip, {
    [classes.genreChip]: type === 'genres',
    [classes.speedChip]: type === 'speed',
    [classes.capacityChip]: type === 'capacity',
    [classes.membershipChip]: type === 'membership',
  });

  return (
    <Chip
      label={name}
      key={chipKey}
      classes={{ root: wrapperClassName }}
      onDelete={() => onRemove(chipKey, type)}
    />
  );
}
