import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export interface ListElementBookProps {
  coverImage?: any;
  primaryText?: string;
  secondaryText?: string;
  primary?: JSX.Element;
  secondary?: JSX.Element;
  onClick?: any;
}

const useStyles = makeStyles(() =>
  createStyles({
    coverImage: {
      height: 64,
      width: 40,
      borderRadius: 5,
      marginRight: 16,
    },
  })
);

export default function ListElementBook(props: ListElementBookProps) {
  const classes = useStyles();

  const { coverImage, primaryText, secondaryText, primary, secondary } = props;

  return (
    <ListItem button>
      {primary}
      <img src={coverImage} alt={primaryText} className={classes.coverImage} />
      <ListItemText
        primary={primaryText ? primaryText : 'Group member'}
        secondary={secondaryText ? secondaryText : null}
      />
      {secondary}
    </ListItem>
  );
}
