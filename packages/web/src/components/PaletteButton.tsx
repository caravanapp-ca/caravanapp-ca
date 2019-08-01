import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles, Fab } from '@material-ui/core';
import { PaletteObject } from '@caravan/buddy-reading-types';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      borderRadius: '50%',
      boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.5)',
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    img: {
      height: '100%',
      width: '100%',
      borderRadius: '50%',
      objectFit: 'cover',
    },
  })
);

interface PaletteButtonProps {
  size?: number;
  palette: PaletteObject;
  onClick: (palette: PaletteObject) => void;
}

export default function PaletteButton(props: PaletteButtonProps) {
  const { size, palette, onClick } = props;
  const classes = useStyles();
  const sizeCalc = size || 36;
  const bgImage = palette.bgImage;
  const bgColour = palette.key;
  return (
    <div
      className={classes.root}
      style={{
        height: sizeCalc,
        width: sizeCalc,
        backgroundColor: bgColour,
      }}
      onClick={() => onClick(palette)}
    >
      {bgImage && <img src={bgImage} className={classes.img} />}
    </div>
  );
}
