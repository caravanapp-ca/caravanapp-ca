import React from 'react';
import {
  makeStyles,
  createStyles,
  Typography,
  Button,
  useTheme,
} from '@material-ui/core';
import clsx from 'clsx';
import { washedTheme } from '../theme';
import { MuiThemeProvider } from '@material-ui/core/styles';

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
  clickable?: boolean;
  onClick?: (genreKey: string, currActive: boolean) => void;
}

export default function GenreChip(props: GenreChipProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { genreKey, name, active, clickable, onClick } = props;
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
      <MuiThemeProvider theme={active ? theme : washedTheme}>
        <Button
          className={classes.button}
          color="primary"
          variant="contained"
          key={genreKey}
          onClick={() => onClick(genreKey, active)}
        >
          {/* TODO: Prevent capitalization */}
          <Typography>{name}</Typography>
        </Button>
      </MuiThemeProvider>
    );
  }
}
