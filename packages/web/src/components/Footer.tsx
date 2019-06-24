import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Built with ❤️by the Caravan team.
    </Typography>
  );
}

export default function Footer() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <footer className={classes.footer}>
        <MadeWithLove />
        <Typography
          variant="body2"
          color="textSecondary"
          align="center"
          component="p"
        >
          {'We want to hear what you have to say! Check out our '}
          <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdpPzKPO9Spx7ovBKh5Q6n977hgBRbxTgiKVPaDIRnkjfb9jQ/viewform">
            feedback form.
          </Link>
          <br />
          {'View our '}
          <Link href="/privacy">privacy policy.</Link>
        </Typography>
      </footer>
    </React.Fragment>
  );
}
