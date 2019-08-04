import React from 'react';
import { Typography } from '@material-ui/core';

interface HeaderTitleProps {
  title: String;
}

// const useStyles = makeStyles((theme: Theme) =>
//   createStyles({
//     accentTextStyle: {
//       ...theme.typography.h5,
//       color: theme.palette.primary.main,
//       fontWeight: 600,
//     },
//   })
// );

export default function HeaderTitle(props: HeaderTitleProps) {
  const { title } = props;
  // const classes = useStyles();
  return (
    <Typography variant="h5" color="textPrimary">
      {title}
      {/* Uncomment to re-add purple period. */}
      {/* <span className={classes.accentTextStyle}>.</span> */}
    </Typography>
  );
}
