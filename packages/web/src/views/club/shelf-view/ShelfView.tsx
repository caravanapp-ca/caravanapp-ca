import React from 'react';
import { Typography } from '@material-ui/core';
import BookList from './BookList';
import { ShelfEntry } from '@caravan/buddy-reading-types';

interface ShelfViewProps {
  shelf: ShelfEntry[];
}

export default function ShelfView(props: ShelfViewProps) {
  return (
    <div>
      <Typography>Currently Reading</Typography>
      <BookList />
      <Typography>To be Read</Typography>
      <BookList />
      <Typography>Previously Reading</Typography>
      <BookList />
    </div>
  );
}
