import React from 'react';
import { makeStyles, createStyles, useTheme, Chip } from '@material-ui/core';
import clsx from 'clsx';
import { washedTheme } from '../../theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import { FilterChipType } from '@caravan/buddy-reading-types';

const useStyles = makeStyles(theme =>
  createStyles({
    genreChip: {
      borderRadius: 4,
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(1),
      backgroundColor: '#bbdefb',
    },
    speedChip: {
      borderRadius: 4,
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(1),
      backgroundColor: '#b2dfdb',
    },
    capacityChip: {
      borderRadius: 4,
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(1),
      backgroundColor: '#dcedc8',
    },
    membershipChip: {
      borderRadius: 4,
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(1),
      backgroundColor: '#80deea',
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
  const theme = useTheme();

  const { name, active, type, chipKey, onRemove } = props;

  const wrapperClassName = clsx({
    [classes.genreChip]: type === 'genres',
    [classes.speedChip]: type === 'speed',
    [classes.capacityChip]: type === 'capacity',
    [classes.membershipChip]: type === 'membership',
  });

  return (
    <MuiThemeProvider theme={active ? theme : washedTheme}>
      <Chip
        label={name}
        key={chipKey}
        classes={{ root: wrapperClassName }}
        onDelete={() => onRemove(chipKey, type)}
      />
    </MuiThemeProvider>
  );
}
