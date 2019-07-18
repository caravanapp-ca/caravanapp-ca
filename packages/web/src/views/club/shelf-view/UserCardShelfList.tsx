import React from 'react';
import {
  makeStyles,
  createStyles,
  useTheme,
  Grid,
  Tooltip,
} from '@material-ui/core';
import ForwardIcon from '@material-ui/icons/ArrowForwardIos';
import BackwardIcon from '@material-ui/icons/ArrowBackIos';
import { ShelfEntry } from '@caravan/buddy-reading-types';

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
      margin: 3,
    },
    clickableIcon: {
      height: 20,
      width: 20,
    },
    bookCoverTile: {
      marginRight: theme.spacing(1),
    },
    bookCover: {
      width: '95%',
      height: '95%',
      borderRadius: 5,
      objectFit: 'cover',
      border: '1px solid #E9E9E9',
    },
  })
);

interface UserCardShelfListProps {
  shelf: ShelfEntry[];
}

export default function UserCardShelfList(props: UserCardShelfListProps) {
  const classes = useStyles();

  const { shelf } = props;

  const [indices, setIndices] = React.useState<number[]>([0, 4]);

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
        higherVal = shelf.length - Math.floor(shelf.length % 4);
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
        onClick={() => incrementIndices(-4)}
      >
        {indices[0] > 0 && <BackwardIcon color="primary" />}
      </div>
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="stretch"
        spacing={1}
        className={classes.gridListDiv}
      >
        {shelf.slice(indices[0], indices[1]).map(book => (
          <Grid item key={book.sourceId} xs={3}>
            <Tooltip title={book.title} aria-label={book.title}>
              <img
                src={book.coverImageURL}
                alt={'Book cover'}
                className={classes.bookCover}
              />
            </Tooltip>
          </Grid>
        ))}
      </Grid>
      <div
        className={classes.clickableIcon}
        onClick={() => incrementIndices(4)}
      >
        {indices[1] <= shelf.length - 1 && <ForwardIcon color="primary" />}
      </div>
    </div>
  );
}
