import React from 'react';
import { ShelfEntry } from '@caravan/buddy-reading-types';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListElementBook from '../../../components/ListElementBook';
import { Radio, IconButton, Typography, Paper } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PlusIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

interface BookListProps {
  data: ShelfEntry[];
  primary?: 'radio';
  secondary?: 'delete' | 'add';
  onClick?: any;
  onRadioPress?: (value: string) => void;
  radioValue?: string;
  onDelete?: (id: string) => void;
  onAdd?: (book: ShelfEntry) => void;
}

export default function BookList(props: BookListProps) {
  const classes = useStyles();
  const {
    data,
    primary,
    secondary,
    onClick,
    onRadioPress,
    radioValue,
    onDelete,
    onAdd,
  } = props;

  function radio(b: ShelfEntry, index: number): JSX.Element {
    if (onRadioPress && radioValue) {
      return (
        <Radio
          checked={radioValue === b._id}
          onChange={(e, checked) => onRadioPress(e.target.value)}
          value={b._id}
          name={`radio-button-${b.title}`}
          color="primary"
        />
      );
    } else {
      throw new Error(
        'You need to pass an onRadioPress function, and radioValue prop to BookList to set primary = "radio"'
      );
    }
  }

  function deleteIcon(b: ShelfEntry, index: number): JSX.Element {
    if (onDelete) {
      return (
        <IconButton
          className={classes.button}
          value={b._id}
          onClick={() => onDelete(b._id)}
        >
          <DeleteIcon />
        </IconButton>
      );
    } else {
      throw new Error(
        'You need to pass an onDelete function to set secondary = "delete"'
      );
    }
  }

  function addIcon(b: ShelfEntry, index: number): JSX.Element {
    if (onAdd) {
      return (
        <IconButton
          className={classes.button}
          value={b._id}
          onClick={() => onAdd(b)}
        >
          <PlusIcon />
        </IconButton>
      );
    } else {
      throw new Error(
        'You need to pass an onAdd function to set secondary = "add"'
      );
    }
  }

  return (
    <Paper>
      <List dense={false}>
        {data.map((b, index) => {
          let selected = false;
          if (radioValue) {
            if (b._id === radioValue) {
              selected = true;
            }
          }
          let primaryElement;
          switch (primary) {
            case 'radio':
              primaryElement = radio(b, index);
              break;
          }
          let secondaryElement;
          switch (secondary) {
            case 'delete':
              secondaryElement = deleteIcon(b, index);
              break;
            case 'add':
              secondaryElement = addIcon(b, index);
              break;
          }
          return (
            <ListElementBook
              coverImage={b.coverImageURL}
              primaryText={b.title}
              secondaryText={b.author}
              key={b.isbn || index}
              primary={primaryElement}
              secondary={secondaryElement}
              onClick={onClick}
              selected={selected}
            />
          );
        })}
      </List>
    </Paper>
  );
}
