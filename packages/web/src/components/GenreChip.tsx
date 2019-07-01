import React from 'react';
import {
  makeStyles,
  Theme,
  createStyles,
  Typography,
  Button,
  useTheme,
} from '@material-ui/core';
import clsx from 'clsx';
import { washedTheme } from '../theme';

const useStyles = makeStyles(theme =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
    chip: {
      display: 'flex',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      margin: theme.spacing(1),
      borderRadius: 4,
    },
    chipActive: {
      backgroundColor: theme.palette.primary.main,
      color: '#FFFFFF',
    },
    chipInactive: {
      backgroundColor: washedTheme.palette.primary.light,
      color: theme.palette.text.primary,
    },
    activeText: {
      color: '#FFFFFF',
    },
  })
);

interface GenreChipProps {
  key: string;
  name: string;
  active: boolean;
  clickable?: true;
  onClick?: (key: string) => void;
}

export default function GenreChip(props: GenreChipProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { key, name, active, clickable, onClick } = props;
  if (!clickable || !onClick) {
    return (
      <div
        className={
          active
            ? clsx(classes.chip, classes.chipActive)
            : clsx(classes.chip, classes.chipInactive)
        }
      >
        <Typography variant="body1">{name}</Typography>
      </div>
    );
  } else {
    return (
      <Button
        className={classes.button}
        color={active ? 'primary' : 'default'}
        variant="contained"
        key={key}
        onClick={() => onClick(key)}
      >
        <Typography variant="button">{name}</Typography>
      </Button>
    );
  }
}
