import React from 'react';
import Slider, { Settings } from 'react-slick';
import { makeStyles, createStyles, Tooltip } from '@material-ui/core';
import { ShelfEntry } from '@caravan/buddy-reading-types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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
      width: 80,
      height: 128,
      borderRadius: 5,
      objectFit: 'cover',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
      marginRight: theme.spacing(2),
    },
  })
);

interface UserCardShelfListProps {
  shelf: ShelfEntry[];
}

const generateSliderSettings = (shelf: ShelfEntry[]): Settings => ({
  className: 'shelf-slider',
  dots: true,
  infinite: false,
  slidesToShow: Math.min(4, shelf.length),
  slidesToScroll: Math.min(4, shelf.length),
  arrows: true,
  variableWidth: true,
});

export default function UserCardShelfList(props: UserCardShelfListProps) {
  const classes = useStyles();
  const { shelf } = props;
  const settings = generateSliderSettings(shelf);

  return (
    <div>
      <Slider {...settings}>
        {shelf.map(book => (
          <div>
            <Tooltip title={book.title} aria-label={book.title}>
              <img
                src={book.coverImageURL}
                alt={'Book cover'}
                className={classes.bookCover}
              />
            </Tooltip>
          </div>
        ))}
      </Slider>
    </div>
  );
}
