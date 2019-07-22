import React from 'react';
import {
  ShelfEntry,
  UserShelfEntry,
  FilterAutoMongoKeys,
} from '@caravan/buddy-reading-types';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListElementBook from '../../../components/ListElementBook';
import { Radio, IconButton, Paper, Link } from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import PlusIcon from '@material-ui/icons/Add';
import AmazonBuyButton from '../../../components/AmazonBuyButton';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      margin: theme.spacing(1),
    },
  })
);

interface BookListProps {
  data:
    | ShelfEntry
    | UserShelfEntry
    | FilterAutoMongoKeys<ShelfEntry>[]
    | FilterAutoMongoKeys<UserShelfEntry>[];
  primary?: 'radio';
  secondary?: 'delete' | 'add';
  tertiary?: 'buy';
  onClick?: any;
  onRadioPress?: (value: string) => void;
  radioValue?: string;
  onDelete?: (id: string, index: number) => void;
  onAdd?: (book: ShelfEntry) => void;
  footerElement?: JSX.Element;
}

export default function BookList(props: BookListProps) {
  const classes = useStyles();
  const {
    data,
    primary,
    secondary,
    tertiary,
    onClick,
    onRadioPress,
    radioValue,
    onDelete,
    onAdd,
    footerElement,
  } = props;

  function radio(
    b: FilterAutoMongoKeys<ShelfEntry>,
    index: number
  ): JSX.Element {
    if (onRadioPress && radioValue) {
      return (
        <Radio
          checked={radioValue === b.sourceId}
          onChange={(e, checked) => onRadioPress(e.target.value)}
          value={b.sourceId}
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

  function deleteIcon(
    b: FilterAutoMongoKeys<ShelfEntry>,
    index: number
  ): JSX.Element {
    if (onDelete) {
      return (
        <IconButton
          className={classes.button}
          value={b.sourceId || index}
          onClick={() => onDelete(b.sourceId, index)}
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

  function buyButton(b: ShelfEntry): JSX.Element | undefined {
    if (b.amazonLink) {
      return <AmazonBuyButton />;
    } else {
      return undefined;
    }
  }

  return (
    <Paper>
      <List dense={false}>
        {(data as UserShelfEntry[]).map((b, index) => {
          let selected = false;
          if (radioValue && radioValue === b._id) {
            selected = true;
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
          let tertiaryElement;
          switch (tertiary) {
            case 'buy':
              tertiaryElement = buyButton(b);
          }
          return (
            <ListElementBook
              clubId={b.clubId}
              club={b.club}
              coverImage={b.coverImageURL}
              primaryText={b.title}
              secondaryText={b.author}
              key={b.isbn || index}
              primary={primaryElement}
              secondary={secondaryElement}
              tertiary={tertiaryElement}
              tertiaryLink={b.amazonLink}
              onClick={onClick}
              selected={selected}
            />
          );
        })}
        {footerElement}
      </List>
    </Paper>
  );
}
