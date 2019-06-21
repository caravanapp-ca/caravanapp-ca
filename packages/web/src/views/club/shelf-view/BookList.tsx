import React from 'react';
import { ShelfEntry } from '@caravan/buddy-reading-types';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Avatar from '@material-ui/core/Avatar';
import ListElementBook from '../../../components/ListElementBook';
import { Radio } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface BookListProps {
  data: ShelfEntry[];
  primary?: 'radio';
  secondary?: JSX.Element;
  onClick?: any;
  onRadioPress?: (value: string) => void;
  radioValue?: string;
}

export default function BookList(props: BookListProps) {
  const classes = useStyles();
  const { data, primary, secondary, onClick, onRadioPress, radioValue } = props;

  function radio(b: ShelfEntry, index: number): JSX.Element {
    if (onRadioPress && radioValue) {
      return (
        <Radio
          checked={radioValue === b._id}
          onChange={(e, checked) => onRadioPress(e.target.value)}
          value={b._id}
          name={`radio-button-${b.title}`}
        />
      );
    } else {
      return <></>;
    }
  }

  return (
    <List dense={false}>
      {data.map((b, index) => {
        let primaryElement;
        if (primary === 'radio') {
          primaryElement = radio(b, index);
        }
        return (
          <ListElementBook
            coverImage={b.coverImageURL}
            primaryText={b.title}
            secondaryText={b.author}
            key={b.isbn || index}
            primary={primaryElement}
            secondary={secondary}
            onClick={onClick}
          />
        );
      })}
    </List>
  );
}
