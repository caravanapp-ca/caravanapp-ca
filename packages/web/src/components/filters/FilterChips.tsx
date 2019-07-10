import React from 'react';
import {
  makeStyles,
  createStyles,
  Typography,
  Button,
  useTheme,
  Fab,
  useMediaQuery,
  PropTypes,
} from '@material-ui/core';
import clsx from 'clsx';
import { washedTheme } from '../../theme';
import { MuiThemeProvider } from '@material-ui/core/styles';
import RemoveIcon from '@material-ui/icons/Clear';
import { FilterChipType } from '@caravan/buddy-reading-types';

const useStyles = makeStyles(theme =>
  createStyles({
    button: {
      margin: theme.spacing(1),
      textTransform: 'none',
    },
    chip: {
      display: 'flex',
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1),
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
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

interface FilterChipsProps {
  name: string;
  active: boolean;
  type: FilterChipType;
  key: string;
  onRemove: (key: string, type: FilterChipType) => void;
}

export default function FilterChips(props: FilterChipsProps) {
  const classes = useStyles();
  const theme = useTheme();
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  const { name, active, type, key, onRemove } = props;

  let color: PropTypes.Color = 'primary';

  if (type === 'genres') {
    color = 'primary';
  } else if (type === 'speed') {
    color = 'secondary';
  } else if (type === 'capacity') {
    color = 'default';
  }

  return (
    <MuiThemeProvider theme={active ? theme : washedTheme}>
      <Button
        className={classes.button}
        color={color}
        variant="contained"
        key={key}
      >
        <Fab
          color={active ? 'inherit' : 'primary'}
          onClick={() => onRemove(key, type)}
        >
          <RemoveIcon />
        </Fab>
        <Typography
          style={{
            fontSize: screenSmallerThanSm ? 11 : 16,
          }}
        >
          {name}
        </Typography>
      </Button>
    </MuiThemeProvider>
  );
}
