import React from 'react';
import Slider, { Settings } from 'react-slick';
import { makeStyles, createStyles, Tooltip } from '@material-ui/core';
import { ShelfEntry } from '@caravanapp/buddy-reading-types';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { theme } from '../theme';
import ReactResizeDetector from 'react-resize-detector';

const bookCoverHeight = 96;
const bookCoverWidth = 60;
const bookCoverMarginRight = theme.spacing(2);

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

interface UserCardShelfListProps {
  shelf: ShelfEntry[];
}

const getSlidesToShow = (width: number): number => {
  return Math.floor(width / (bookCoverWidth + bookCoverMarginRight));
};

const generateSliderSettings = (
  slidesToShow: number,
  shelf: ShelfEntry[]
): Settings => ({
  className: 'shelf-slider',
  dots: true,
  infinite: false,
  slidesToShow: Math.min(slidesToShow, shelf.length),
  slidesToScroll: Math.min(slidesToShow, shelf.length),
  variableWidth: true,
});

export default function UserCardShelfList(props: UserCardShelfListProps) {
  const classes = useStyles();
  const { shelf } = props;
  const [slidesToShow, setSlidesToShow] = React.useState<number>(4);

  const settings = generateSliderSettings(slidesToShow, shelf);

  return (
    <div>
      <Slider {...settings}>
        {shelf.map(book => (
          <div key={book._id}>
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
      <ReactResizeDetector
        handleWidth
        onResize={(w, h) => setSlidesToShow(getSlidesToShow(w))}
      />
    </div>
  );
}
