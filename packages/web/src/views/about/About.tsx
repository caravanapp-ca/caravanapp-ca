import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  Typography,
  Container,
  IconButton,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { User } from '@caravan/buddy-reading-types';
import Header from '../../components/Header';
import textLogo from '../../resources/text-logo.svg';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    textContainer: {
      padding: `${theme.spacing(6)}px 16px`,
    },
    bodyContainer: {
      marginTop: theme.spacing(4),
    },
    title: {},
    subtitle: {},
    body: {},
  })
);

interface AboutProps extends RouteComponentProps<{}> {
  user: User | null;
}

const title = 'The Caravan Mission';

const subtitle = 'Inspiring Real Conversations With Books & Buddies';

const body = [
  'For most of us, if not all of us, real discussion — having an honest and meaningful conversation — is more comfortable with someone that we already know.',
  'This familiarity gives us a sense of mutual trust. Mutual trust is the key to making us feel comfortable voicing our thoughts and opinions.',
  'This need for association can sometimes be avoided online, even if a bit underhandedly. The anonymity offered by sites like Reddit & Twitter provides liberty. A good deal of the sharing that takes place on these sites occurs precisely because people are free from their real lives. The virtual masks they wear embolden them to speak the stories and share the thoughts that they may be scared or embarrassed or unable to tell in person.',
  'They’re given a chance to reveal and accept aspects of their own lives that wouldn’t have been possible otherwise. There’s a genuine beauty to this freedom.',
  'Of course, this same freedom has allowed many people to share and proliferate countless horrendous ideas, as well. The internet’s masks — this anonymity — can mentally separate us from our own words, and by extension, from the consequences of what we’ve done and the pain we may have caused.',
  'However, even if we look exclusively at the real liberation of ideas that it can bring, anonymity is a limited mechanism for encouraging honest and meaningful dialogue. It makes us feel like we’re talking ‘at’ people, rather than ‘with’ people.',
  'If we’re not genuinely familiar with anyone we’re speaking to, our loyalty and trust can only extend to the platform itself — not to the people we interact with. We need to trust the general type of person we expect to be using the platform, but we’re not given a chance to trust any individual.',
  'Product love and loyalty can only go so far in an anonymous system like this.',
  'Without trust for the people surrounding us, abandoning ship for the newer, shinier website is incredibly easy. We see this all the time in today’s fast-paced tech world, where the vastness of online spaces leave people feeling isolated and alone, despite the millions of people online every day.',
  'When I think about the impact that human bonds can have on our relationship with a platform, I’m always reminded of the groups of World of Warcraft players who’ve been playing together for over ten years.',
  'Sure, newer and shinier games have been released, and sure, they’ve dabbled a bit in playing those, but they consistently come back to World of Warcraft. This allegiance doesn’t just stem from the game itself but is a consequence of WoW, enabling them to discover and cultivate authentic friendships. Friendships with people who were previously anonymous gamers wearing their own internet masks.',
  'These friendships, and WoW’s hand in forging them, pull people back into the game as much as the game itself. They’re what’s given it the gravity it’s needed to stand the test of time.',
  'Herein lies one of the foremost challenges when trying to inspire real conversations in online book clubs, as we aim to do. Honest and meaningful dialogue hinges on a deep person-to-person connection — on trust and familiarity.',
  'These types of bonds between users encourage accountability and embolden their confidence in conversation. By helping build these bonds, brands can earn rapport with people in a way that anonymity can never match.',
  'More importantly, if done properly, having a hand in these relationships inspires true loyalty in users.',
  'And that isn’t just loyalty to the brand. It’s loyalty to the people they interact with. A loyalty whose foundation is users’ mutual trust of the people they’re talking to, not just the faux-security of their internet masks.',
  'We don’t ever want Caravan to rely on bright colours, rewards, and dopamine hits to encourage people to come back and read more.',
  'We want you to come back because you genuinely care for the people you’re grouped with, and because you’re all talking about something you each love — books.',
  'Building this trust is a challenge, absolutely. But the efforts to pull the internet away from the black hole of anonymous sharing need to start somewhere. As a society, we’re at a stage now where having meaningful conversations is more critical than ever. Bringing people together — really together — is the first step in accomplishing this.',
  'The movement towards personal relationships has been a part of our vision since day one.',
  'Our mission isn’t just to assemble book clubs around a given book. Our mission is to connect people, inspire trust, and build friendships — all stemming from a shared love of the written word. Our mission is to help people find their perfect reading buddies.',
  'We believe that loyalty to your peers begets loyalty to the platform, and that these bonds are the cornerstone of anything that people will love for years to come.',
  'Readers are our brand — with all the quirks, charm, and passion that comes with them.',
  'Not books. Not reviews. Not ratings.',
  'Readers.',
];

export default function About(props: AboutProps) {
  const { user } = props;
  const classes = useStyles();

  const handleBack = () => {
    if (props.history.length > 2) {
      props.history.goBack();
    } else {
      props.history.replace('/');
    }
  };

  const leftComponent = (
    <IconButton edge="start" aria-label="Back" onClick={handleBack}>
      <ArrowBackIos />
    </IconButton>
  );

  const centerComponent = (
    <img
      src={textLogo}
      alt="Caravan logo"
      style={{ height: 20, objectFit: 'contain' }}
    />
  );

  const rightComponent = <ProfileHeaderIcon user={user} />;

  return (
    <>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container maxWidth="md" className={classes.textContainer}>
        <Typography variant="h3" className={classes.title} gutterBottom>
          {title}
        </Typography>
        <Typography
          variant="h5"
          color="textSecondary"
          className={classes.subtitle}
        >
          {subtitle}
        </Typography>
        <div className={classes.bodyContainer}>
          {body.map(p => (
            <Typography variant="body1" className={classes.body} paragraph>
              {p}
            </Typography>
          ))}
        </div>
      </Container>
    </>
  );
}
