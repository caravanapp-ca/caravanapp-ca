import React from 'react';
import { ClubWithCurrentlyReading } from './Home';
import {
  CircularProgress,
  createMuiTheme,
  useMediaQuery,
  Avatar,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/PersonOutline';
import {
  makeStyles,
  responsiveFontSizes,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { User } from '@caravan/buddy-reading-types';
import {
  groupVibeIcons,
  groupVibeLabels,
} from '../../components/group-vibe-avatars-icons-labels';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../../components/reading-speed-avatars-icons-labels';
import AdapterLink from '../../components/AdapterLink';
import theme from '../../theme';
import UserAvatar from '../user/UserAvatar';
import GenresInCommonChips from '../../components/GenresInCommonChips';

const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    margin: theme.spacing(2),
  },
  cardContent: {
    position: 'relative',
    zIndex: 1,
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
  },
  iconWithLabel: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconLabel: {
    marginLeft: 8,
  },
  iconRoot: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    margin: theme.spacing(1),
  },
  userHeading: {
    position: 'relative',
    'border-radius': '4px',
    height: '100px',
    width: '100%',
  },
  userTextContainer: {
    position: 'absolute',
    width: '100%',
    bottom: 10,
    left: 10,
    padding: theme.spacing(2),
  },
  userNameText: {
    fontWeight: 600,
  },
  userAvatarContainer: {
    position: 'absolute',
    width: 112,
    height: 112,
    top: 20,
    right: 10,
    'border-radius': '50%',
    padding: theme.spacing(2),
    zIndex: 1,
  },
  fieldTitleText: {
    fontStyle: 'italic',
    marginTop: theme.spacing(1),
  },
  genresInCommon: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  noGenresText: {},
  clubImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    'object-fit': 'cover',
    'object-position': '50% 50%',
    filter: 'blur(4px)',
  },
  clubImageShade: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    background: 'rgba(0, 0, 0, 0.4)',
  },
  imageText: {
    width: '100%',
    'text-align': 'left',
    color: '#ffffff',
  },
  imageTitleText: {
    width: '100%',
    'text-align': 'left',
    color: '#ffffff',
    fontWeight: 600,
  },
  progress: {
    margin: theme.spacing(2),
  },
}));

interface UserCardProps {
  users: User[];
  user: User | null;
}

export default function UserCards(props: UserCardProps) {
  const classes = useStyles();
  const { users, user } = props;

  const screenSmallerThanMd = useMediaQuery(theme.breakpoints.down('sm'));
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [visitProfileLoadingId, setVisitProfileLoadingId] = React.useState('');

  const onCloseLoginDialog = () => {
    setLoginModalShown(false);
  };

  function shuffleArr(arr: string[]) {
    for (let i = arr.length; i; i--) {
      let j = Math.floor(Math.random() * i);
      [arr[i - 1], arr[j]] = [arr[j], arr[i - 1]];
    }
  }

  let myGenres: string[] = [];
  if (user) {
    myGenres = user.selectedGenres.map(x => x.name);
  }

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {users.map(u => {
            const userTheme = u
              ? responsiveFontSizes(
                  createMuiTheme({
                    ...theme,
                    palette: {
                      ...theme.palette,
                      primary: {
                        main:
                          u && u.palette
                            ? u.palette.key
                            : theme.palette.primary.main,
                      },
                    },
                  })
                )
              : theme;
            const otherUsersGenres: string[] = u.selectedGenres.map(
              x => x.name
            );

            const otherGenresSet = new Set(otherUsersGenres);
            const myGenresSet = new Set(myGenres);
            const commonGenres = Array.from(
              //@ts-ignore
              new Set([...otherGenresSet].filter(val => myGenresSet.has(val)))
            );
            shuffleArr(commonGenres);
            let otherUniqueGenres: string[] = [];
            if (commonGenres.length < 5) {
              otherUniqueGenres = otherUsersGenres.filter(
                val => !myGenres.includes(val)
              );
              shuffleArr(otherUniqueGenres);
              otherUniqueGenres = otherUniqueGenres.slice(
                0,
                Math.min(5 - commonGenres.length, 5)
              );
            }

            return (
              <MuiThemeProvider theme={userTheme}>
                <Grid item key={u._id} xs={12} sm={6}>
                  <Card className={classes.card}>
                    <div
                      className={classes.userHeading}
                      style={{
                        backgroundColor:
                          u && u.palette
                            ? userTheme.palette.primary.main
                            : undefined,
                      }}
                    >
                      <div className={classes.userTextContainer}>
                        <Typography
                          variant="h4"
                          className={classes.userNameText}
                        >
                          {u.name}
                        </Typography>
                      </div>
                    </div>
                    <CardContent className={classes.cardContent}>
                      <Typography
                        gutterBottom
                        className={classes.fieldTitleText}
                        color="textSecondary"
                      >
                        Genres
                      </Typography>
                      {otherUsersGenres.length > 0 && (
                        <div className={classes.genresInCommon}>
                          {commonGenres.map(genre => (
                            <GenresInCommonChips
                              name={genre}
                              backgroundColor={userTheme.palette.primary.main}
                              common={true}
                            />
                          ))}
                          {otherUniqueGenres.map(genre => (
                            <GenresInCommonChips
                              name={genre}
                              backgroundColor={userTheme.palette.primary.main}
                              common={false}
                            />
                          ))}
                        </div>
                      )}
                      {otherUsersGenres.length === 0 && (
                        <Typography
                          variant="body1"
                          className={classes.noGenresText}
                        >
                          User has no genres...
                        </Typography>
                      )}
                      <Typography
                        gutterBottom
                        className={classes.fieldTitleText}
                        color="textSecondary"
                      >
                        Currently reading
                      </Typography>
                      <Typography>{u.bio}</Typography>
                    </CardContent>
                    <CardActions className={classes.cardActions}>
                      <Button
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        component={AdapterLink}
                        to={`/user/${u._id}`}
                      >
                        <Typography variant="button">VIEW CLUB</Typography>
                      </Button>
                      {visitProfileLoadingId === u._id && (
                        <CircularProgress className={classes.progress} />
                      )}
                    </CardActions>
                    <Avatar
                      src={u.photoUrl}
                      className={classes.userAvatarContainer}
                      style={{ borderColor: 'colorPrimary' }}
                    />
                  </Card>
                </Grid>
              </MuiThemeProvider>
            );
          })}
        </Grid>
        <DiscordLoginModal
          onCloseLoginDialog={onCloseLoginDialog}
          open={loginModalShown}
        />
      </Container>
    </main>
  );
}
