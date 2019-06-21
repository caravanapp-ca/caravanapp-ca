import React from 'react';
import { ShelfEntry } from '@caravan/buddy-reading-types';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListElementAvatar from '../../../components/ListElementAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface BookListProps {
  data: ShelfEntry[];
}

export default function BookList(props: BookListProps) {
  const classes = useStyles();
  const { data } = props;

  return (
    <List dense={false}>
      {data.map((b, index) => (
        <ListElementAvatar
          avatarElement={<Avatar alt={b.title} src={b.coverImageURL} />}
          primaryText={b.title}
          key={b.isbn || index}
        />
      ))}
    </List>
  );
}
