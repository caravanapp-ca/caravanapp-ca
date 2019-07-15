import React from 'react';
import { Container, Typography, useTheme } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(() => ({}));

export default function EmptyClubsFilterResult() {
  const theme = useTheme();

  return (
    <Container maxWidth="md">
      <Typography
        color="textSecondary"
        style={{
          textAlign: 'center',
          fontStyle: 'italic',
          marginTop: theme.spacing(4),
          marginBottom: theme.spacing(4),
        }}
      >
        Oops..no clubs turned up! Try again with different filters.
      </Typography>
    </Container>
  );
}
