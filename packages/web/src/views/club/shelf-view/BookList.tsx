import React from 'react';
import { ShelfEntry } from '@caravan/buddy-reading-types';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListElementBook from '../../../components/ListElementBook';
import { Radio, IconButton, Typography } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import { FastfoodOutlined } from '@material-ui/icons';

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
  secondary?: 'delete';
  onClick?: any;
  onRadioPress?: (value: string) => void;
  radioValue?: string;
  onDelete?: (id: string) => void;
  selectedLabel?: string;
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
    selectedLabel,
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
          aria-label="Delete"
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

  return (
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
        }
        return (
          <>
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
            {selected && selectedLabel && (
              <Typography>{selectedLabel}</Typography>
            )}
          </>
        );
      })}
    </List>
  );
}
