import clsx from 'clsx';
import React, { createRef } from 'react';

import { Container, Link, makeStyles, Typography } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
    textAlign: 'center',
  },
  footerContainer: {
    padding: 0,
  },
  linksContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  sticky: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    left: 0,
  },
  link: {
    margin: '0px 8px',
  },
}));

function MadeWithLove() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      Built with{' '}
      <span role="img" aria-label="love">
        ❤️
      </span>{' '}
      for{' '}
      <span role="img" aria-label="books">
        📖
      </span>{' '}
      by the Caravan team.
    </Typography>
  );
}

interface FooterProps {
  docHeight: number;
}

export default function Footer(props: FooterProps) {
  const classes = useStyles();
  // const { docHeight } = props;
  const footerHeightRef = createRef<HTMLElement>();
  // const [docHeightLTWinHeight, setDocHeightLTWinHeight] = React.useState<
  //   boolean
  // >(
  //   docHeight +
  //     (footerHeightRef && footerHeightRef.current
  //       ? footerHeightRef.current.offsetHeight
  //       : 0) <
  //     window.innerHeight
  // );

  // TODO: Commenting these for performance
  // useEffect(() => {
  //   window.addEventListener('resize', updateFooterState);
  //   return () => {
  //     window.removeEventListener('resize', updateFooterState);
  //   };
  // }, []);

  // useEffect(() => {
  //   updateFooterState();
  // }, [docHeight]);

  // const updateFooterState = () => {
  //   setDocHeightLTWinHeight(
  //     docHeight +
  //       (footerHeightRef && footerHeightRef.current
  //         ? footerHeightRef.current.offsetHeight
  //         : 0) <
  //       window.innerHeight
  //   );
  // };

  return (
    // TODO: Fix sticky footer on everything
    <footer
      className={clsx(classes.footer, {
        [classes.sticky]: false,
        // [classes.sticky]: !isMobileDevice() && docHeightLTWinHeight,
      })}
      ref={footerHeightRef}
    >
      <Container maxWidth="sm" className={classes.footerContainer}>
        <MadeWithLove />
        <div className={classes.linksContainer}>
          <Link href="https://discord.com/download" className={classes.link}>
            Download Discord
          </Link>
          <Link
            href="https://forms.gle/rzcHzCMgwMx7wxgRA"
            className={classes.link}
          >
            Feedback
          </Link>
          <Link href="/privacy" className={classes.link}>
            Privacy Policy
          </Link>
          <Link href="/about" className={classes.link}>
            About Us
          </Link>
        </div>
        <Typography variant="caption" color="textSecondary" align="center">
          Caravan is a participant in the Amazon Associates Program, meaning we
          receive a small portion of purchases made through links on our site.
        </Typography>
      </Container>
    </footer>
  );
}
