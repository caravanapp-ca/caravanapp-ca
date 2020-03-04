import React from 'react';

import { Container, Typography, useTheme } from '@material-ui/core';

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
          // TODO: Change this back to theme.spacing(4) when sticky footer is fixed.
          marginBottom: 512,
        }}
      >
        Oops..no clubs turned up! Try again with different filters.
      </Typography>
    </Container>
  );
}
