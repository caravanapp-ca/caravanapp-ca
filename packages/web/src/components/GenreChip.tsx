import clsx from 'clsx';
import React from 'react';

import {
  Button,
  createStyles,
  makeStyles,
  MuiThemeProvider,
  Typography,
  useTheme,
} from '@material-ui/core';

import { washedTheme } from '../theme';

const useStyles = makeStyles(theme =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      textTransform: 'none',
      minWidth: '25px',
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
      backgroundColor: washedTheme.palette.primary.main,
      color: theme.palette.text.primary,
    },
    activeText: {
      color: '#FFFFFF',
    },
    chipText: {
      root: {
        textTransform: 'none',
      },
    },
  })
);

interface GenreChipProps {
  genreKey: string;
  name: string;
  active: boolean;
  small?: boolean;
  clickable?: boolean;
  onClick?: (genreKey: string, currActive: boolean) => void;
}

export default function GenreChip(props: GenreChipProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { genreKey, name, active, clickable, onClick, small } = props;
  if (!clickable || !onClick) {
    return (
      <div
        className={clsx(classes.chip, {
          [classes.chipActive]: active,
          [classes.chipInactive]: !active,
        })}
      >
        <Typography variant="body1">{name}</Typography>
      </div>
    );
  } else {
    return (
      <MuiThemeProvider theme={active ? theme : washedTheme}>
        <Button
          classes={{
            root: classes.button,
          }}
          color="primary"
          key={genreKey}
          onClick={() => onClick(genreKey, active)}
          variant="contained"
          size={small ? 'small' : 'medium'}
        >
          <Typography>{name}</Typography>
        </Button>
      </MuiThemeProvider>
    );
  }
}
