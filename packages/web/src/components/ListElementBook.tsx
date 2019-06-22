import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  ListItem,
  ListItemText,
  Paper,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';

export interface ListElementBookProps {
  coverImage?: any;
  primaryText?: string;
  secondaryText?: string;
  primary?: JSX.Element;
  secondary?: JSX.Element;
  onClick?: any;
  selected?: boolean;
}

const useStyles = makeStyles(theme => ({
  coverImage: {
    height: 80,
    width: 50,
    borderRadius: 5,
    marginRight: 16,
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: theme.palette.primary.main,
  },
}));

export default function ListElementBook(props: ListElementBookProps) {
  const classes = useStyles();

  const {
    coverImage,
    primaryText,
    secondaryText,
    primary,
    secondary,
    selected,
  } = props;

  return (
    <Paper className={selected ? classes.selectedContainer : undefined}>
      <ListItem>
        {primary && <ListItemIcon>{primary}</ListItemIcon>}
        <img
          src={coverImage}
          alt={primaryText}
          className={classes.coverImage}
        />
        <ListItemText
          primary={primaryText ? primaryText : 'Group member'}
          secondary={secondaryText ? secondaryText : null}
        />
        {secondary && (
          <ListItemSecondaryAction>{secondary}</ListItemSecondaryAction>
        )}
      </ListItem>
    </Paper>
  );
}
