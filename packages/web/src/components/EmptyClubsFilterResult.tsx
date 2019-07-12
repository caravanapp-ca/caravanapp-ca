import React from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  finishedCard: {
    marginBottom: 50,
    height: '100px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishedCardContent: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default function EmptyClubsFilterResult() {
  const classes = useStyles();

  return (
    <Container className={classes.cardGrid} maxWidth="md">
      <Grid container spacing={4}>
        <Grid item key={'explanation'} xs={12} sm={12}>
          <Card className={classes.finishedCard}>
            <CardContent className={classes.finishedCardContent}>
              <Typography variant="h5" style={{ fontWeight: 600 }}>
                Oops..no clubs turned up! Try again with different filters.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
