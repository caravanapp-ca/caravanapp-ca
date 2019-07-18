import React from 'react';
import {
  makeStyles,
  createStyles,
  useTheme,
  GridList,
  GridListTile,
  Fab,
  Grid,
} from '@material-ui/core';
import ForwardIcon from '@material-ui/icons/ArrowForwardIos';
import BackwardIcon from '@material-ui/icons/ArrowBackIos';
import { ShelfEntry } from '@caravan/buddy-reading-types';
import { number } from 'prop-types';
import { useEffect } from 'react';

const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    gridListDiv: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'flex-start',
      overflow: 'hidden !important',
      backgroundColor: theme.palette.background.paper,
    },
    clickableIcon: {
      height: 20,
      width: 20,
    },
    gridList: {
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
      width: '100%',
    },
    bookCoverTile: {
      marginRight: theme.spacing(1),
    },
    bookCover: {
      width: '100%',
      height: '100%',
      resizeMode: 'cover',
      'border-width': '1px 1px 1px 1px',
      'border-style': 'solid',
      'border-color': '#5C6BC0',
    },
  })
);

interface UserCardShelfListProps {
  shelf: ShelfEntry[];
}

export default function UserCardShelfList(props: UserCardShelfListProps) {
  const classes = useStyles();
  const theme = useTheme();

  const { shelf } = props;

  const [indices, setIndices] = React.useState<number[]>([0, 3]);

  function incrementIndices(val: number) {
    let higherVal = 0;
    let lowerVal = 0;
    let lowerIndex = indices[0];
    let higherIndex = indices[1];
    if (
      (val > 0 && higherIndex < shelf.length) ||
      (val < 0 && lowerIndex > 0)
    ) {
      if (higherIndex > shelf.length) {
        higherVal = shelf.length - Math.floor(shelf.length % 3);
      } else {
        higherVal = Math.min(higherIndex + val, shelf.length + 1);
      }

      if (lowerIndex === 0) {
        lowerVal = Math.max(0, lowerIndex + val);
      } else {
        lowerVal = Math.min(shelf.length, lowerIndex + val);
      }
      setIndices([lowerVal, higherVal]);
    }
  }

  return (
    <div className={classes.root}>
      <div
        className={classes.clickableIcon}
        onClick={() => incrementIndices(-3)}
      >
        {indices[0] > 0 && <BackwardIcon color="primary" />}
      </div>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        spacing={2}
      >
        {shelf.slice(indices[0], indices[1]).map(book => (
          <Grid item key={book.sourceId} xs={4}>
            <img
              src={book.coverImageURL}
              alt={'Book cover'}
              className={classes.bookCover}
            />
          </Grid>
        ))}
      </Grid>
      <div
        className={classes.clickableIcon}
        onClick={() => incrementIndices(3)}
      >
        {indices[1] <= shelf.length - 1 && <ForwardIcon color="primary" />}
      </div>
    </div>
  );
}
