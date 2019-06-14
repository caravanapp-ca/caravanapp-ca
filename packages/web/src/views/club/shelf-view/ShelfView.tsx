import React from 'react';
import { Typography } from '@material-ui/core'
import BookList from './BookList';

export default function ShelfView() {
  return (
    <div>
      <Typography>Currently Reading</Typography>
        <BookList/>
      <Typography>To be Read</Typography>
        <BookList/>
      <Typography>Previously Reading</Typography>
        <BookList/>
    </div>
  )
}
