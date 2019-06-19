import React, { useMemo } from 'react';
import { Typography } from '@material-ui/core';
import BookList from './BookList';
import { ShelfEntry, ReadingState } from '@caravan/buddy-reading-types';

interface ShelfViewProps {
  shelf: ShelfEntry[];
}

export default function ShelfView(props: ShelfViewProps) {
  const shelfMap = useMemo(() => {
    const map: { [key in ReadingState]: ShelfEntry[] } = {
      current: [],
      notStarted: [],
      read: [],
    };
    props.shelf.forEach(s => {
      map[s.readingState].push(s);
    });
    return map;
  }, props.shelf);

  return (
    <div>
      {shelfMap.current.length > 0 && (
        <>
          <Typography>Currently Reading</Typography>
          <BookList data={shelfMap.current} />
        </>
      )}
      {shelfMap.notStarted.length > 0 && (
        <>
          <Typography>To be Read</Typography>
          <BookList data={shelfMap.notStarted} />
        </>
      )}
      {shelfMap.read.length > 0 && (
        <>
          <Typography>Previously Reading</Typography>
          <BookList data={shelfMap.read} />
        </>
      )}
    </div>
  );
}
