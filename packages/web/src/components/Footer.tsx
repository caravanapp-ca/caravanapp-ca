import React, { useEffect, createRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import clsx from 'clsx';
import { isMobileDevice } from '../functions/isMobileDevice';

const useStyles = makeStyles(theme => ({
  footer: {
    backgroundColor: theme.palette.background.paper,
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(6),
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  sticky: {
    position: 'fixed',
    width: '100%',
    bottom: 0,
    left: 0,
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
  const { docHeight } = props;
  const footerHeightRef = createRef<HTMLElement>();
  const [docHeightLTWinHeight, setDocHeightLTWinHeight] = React.useState<
    boolean
  >(
    docHeight +
      (footerHeightRef && footerHeightRef.current
        ? footerHeightRef.current.offsetHeight
        : 0) <
      window.innerHeight
  );

  useEffect(() => {
    window.addEventListener('resize', updateFooterState);
    return () => {
      window.removeEventListener('resize', updateFooterState);
    };
  }, []);

  useEffect(() => {
    updateFooterState();
  }, [docHeight]);

  const updateFooterState = () => {
    setDocHeightLTWinHeight(
      docHeight +
        (footerHeightRef && footerHeightRef.current
          ? footerHeightRef.current.offsetHeight
          : 0) <
        window.innerHeight
    );
  };

  return (
    // TODO: Fix sticky footer on everything
    <footer
      className={clsx(classes.footer, {
        [classes.sticky]: false,
        // [classes.sticky]: !isMobileDevice() && docHeightLTWinHeight,
      })}
      ref={footerHeightRef}
    >
      <MadeWithLove />
      <Typography
        variant="body2"
        color="textSecondary"
        align="center"
        component="p"
      >
        {'We recommend downloading the Discord app for chat. '}
        <Link href="https://discordapp.com/download">Download here.</Link>
        <br />
        {'We want to hear what you have to say! Check out our '}
        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSdpPzKPO9Spx7ovBKh5Q6n977hgBRbxTgiKVPaDIRnkjfb9jQ/viewform">
          feedback form.
        </Link>
        <br />
        {'View our '}
        <Link href="/privacy">privacy policy.</Link>
      </Typography>
      <div id="amzn-assoc-ad-50924e70-544f-4a5f-97ed-b8e15318c577" />
      <script
        async
        src="//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=50924e70-544f-4a5f-97ed-b8e15318c577"
      />
    </footer>
  );
}
