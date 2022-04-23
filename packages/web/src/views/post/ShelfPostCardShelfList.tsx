import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import React from 'react';
import ReactResizeDetector from 'react-resize-detector';
import Slider, { Settings } from 'react-slick';

import { FilterAutoMongoKeys, ShelfEntry } from '@caravanapp/types';
import { createStyles, makeStyles, Tooltip } from '@material-ui/core';

import { theme } from '../../theme';

const bookCoverHeight = 72;
const bookCoverWidth = 45;
const bookCoverMarginRight = theme.spacing(2);

const useStyles = makeStyles(theme =>
  createStyles({
    shelfList: {
      marginBottom: theme.spacing(2),
    },
    bookCover: {
      width: bookCoverWidth,
      height: bookCoverHeight,
      marginRight: bookCoverMarginRight,
      borderRadius: 5,
      objectFit: 'cover',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
    },
  })
);

interface ShelfPostCardShelfListProps {
  shelf: FilterAutoMongoKeys<ShelfEntry>[];
}

const getSlidesToShow = (width: number): number => {
  return Math.floor(width / (bookCoverWidth + bookCoverMarginRight));
};

const generateSliderSettings = (
  slidesToShow: number,
  shelf: FilterAutoMongoKeys<ShelfEntry>[]
): Settings => ({
  className: 'shelf-slider',
  dots: true,
  infinite: false,
  slidesToShow: Math.min(slidesToShow, shelf.length),
  slidesToScroll: Math.min(slidesToShow, shelf.length),
  variableWidth: true,
});

export default function ShelfPostCardShelfList(
  props: ShelfPostCardShelfListProps
) {
  const classes = useStyles();
  const { shelf } = props;
  const [slidesToShow, setSlidesToShow] = React.useState<number>(4);

  const settings = generateSliderSettings(slidesToShow, shelf);

  return (
    <div className={classes.shelfList}>
      <Slider {...settings}>
        {shelf.map(book => (
          <div key={book.isbn}>
            <Tooltip title={book.title} aria-label={book.title}>
              <img
                src={book.coverImageURL}
                alt={'Book cover'}
                crossOrigin="anonymous"
                className={classes.bookCover}
              />
            </Tooltip>
          </div>
        ))}
      </Slider>
      <ReactResizeDetector
        handleWidth
        onResize={(w, h) => setSlidesToShow(getSlidesToShow(w))}
      />
    </div>
  );
}
