import React from 'react';
import { CircularProgress, createMuiTheme, Avatar } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {
  makeStyles,
  responsiveFontSizes,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { User } from '@caravan/buddy-reading-types';
import AdapterLink from '../../components/AdapterLink';
import theme, { makeUserTheme, makeUserDarkTheme } from '../../theme';
import GenresInCommonChips from '../../components/GenresInCommonChips';
import UserCardShelfList from '../club/shelf-view/UserCardShelfList';

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
    marginTop: theme.spacing(2),
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
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
    margin: 0,
  },
  button: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  userHeading: {
    position: 'relative',
    height: '100px',
    width: '100%',
  },
  userHeadingNoPalette: {
    position: 'relative',
    height: '100px',
    width: '100%',
    'border-style': 'solid',
    'border-color': '#5C6BC0',
    'border-width': '0px 0px 2px 0px',
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
  userWebsiteText: {},
  userAvatarContainer: {
    position: 'absolute',
    width: 112,
    height: 112,
    top: 30,
    right: 10,
    'border-radius': '50%',
    padding: theme.spacing(2),
    zIndex: 1,
    backgroundColor: 'red',
  },
  fieldTitleText: {
    fontStyle: 'italic',
    marginTop: theme.spacing(1),
  },
  genresInCommon: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  emptyFieldText: {},
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

  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [visitProfileLoadingId] = React.useState('');

  const onCloseLoginDialog = () => {
    setLoginModalShown(false);
  };

  let myGenres: string[] = [];
  if (user) {
    myGenres = user.selectedGenres.map(x => x.name);
  }

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        <Grid container spacing={4}>
          {users.map(u => {
            const userTheme = makeUserTheme(u.palette);

            const userDarkTheme = makeUserDarkTheme(u.palette);

            const otherUsersGenres: string[] = u.selectedGenres.map(
              x => x.name
            );

            const otherGenresSet = new Set(otherUsersGenres);
            const myGenresSet = new Set(myGenres);
            let commonGenres = Array.from(
              //@ts-ignore
              new Set([...otherGenresSet].filter(val => myGenresSet.has(val)))
            );

            commonGenres = commonGenres.slice(
              0,
              Math.min(commonGenres.length, 5)
            );

            let otherUniqueGenres: string[] = [];
            if (commonGenres.length < 5) {
              otherUniqueGenres = otherUsersGenres.filter(
                val => !myGenres.includes(val)
              );
              otherUniqueGenres = otherUniqueGenres.slice(
                0,
                Math.min(5 - commonGenres.length, 5)
              );
            }

            const nameField: string = u.name
              ? u.name
              : u.urlSlug
              ? u.urlSlug
              : 'noName';

            return (
              <MuiThemeProvider theme={userTheme}>
                <Grid item key={u._id} xs={12} sm={6} spacing={4}>
                  <Card className={classes.card}>
                    <div
                      className={classes.userHeading}
                      style={{
                        backgroundColor: userTheme
                          ? userTheme.palette.primary.main
                          : theme.palette.primary.main,
                      }}
                    >
                      <div className={classes.userTextContainer}>
                        <MuiThemeProvider theme={userDarkTheme}>
                          <Typography
                            variant="h4"
                            className={classes.userNameText}
                            color="primary"
                            style={
                              !userDarkTheme
                                ? { color: theme.palette.common.white }
                                : undefined
                            }
                          >
                            {nameField}
                          </Typography>
                        </MuiThemeProvider>
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
                              backgroundColor={
                                userTheme
                                  ? userTheme.palette.primary.main
                                  : theme.palette.primary.main
                              }
                              common={true}
                            />
                          ))}
                          {otherUniqueGenres.map(genre => (
                            <GenresInCommonChips
                              name={genre}
                              backgroundColor={
                                userTheme
                                  ? userTheme.palette.primary.main
                                  : theme.palette.primary.main
                              }
                              common={false}
                            />
                          ))}
                        </div>
                      )}
                      {otherUsersGenres.length === 0 && (
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            height: 36,
                          }}
                        >
                          <Typography
                            variant="body1"
                            className={classes.emptyFieldText}
                            color="textSecondary"
                          >
                            User has no genres...
                          </Typography>
                        </div>
                      )}
                      <Typography
                        gutterBottom
                        className={classes.fieldTitleText}
                        color="textSecondary"
                      >
                        Shelf
                      </Typography>
                      {u.shelf.notStarted.length > 0 && (
                        <UserCardShelfList shelf={u.shelf.notStarted} />
                      )}
                      {u.shelf.notStarted.length === 0 && (
                        <Typography
                          variant="body1"
                          className={classes.emptyFieldText}
                          color="textSecondary"
                        >
                          User has no books on their shelf...
                        </Typography>
                      )}
                      {u.questions && u.questions.length > 0 && (
                        <>
                          <Typography
                            className={classes.fieldTitleText}
                            color="textSecondary"
                          >
                            {u.questions[0].title}
                          </Typography>
                          <Typography
                            variant="body1"
                            className={classes.emptyFieldText}
                          >
                            {u.questions[0].answer}
                          </Typography>
                        </>
                      )}
                      {!u.questions ||
                        (u.questions.length === 0 && (
                          <>
                            <Typography
                              className={classes.fieldTitleText}
                              color="textSecondary"
                            >
                              Profile questions
                            </Typography>
                            <Typography
                              variant="body1"
                              className={classes.emptyFieldText}
                              color="textSecondary"
                            >
                              User hasn't answered any profile questions yet...
                            </Typography>
                          </>
                        ))}
                    </CardContent>
                    <CardActions classes={{ root: classes.cardActions }}>
                      <Button
                        className={classes.button}
                        color="primary"
                        component={AdapterLink}
                        to={`/user/${u._id}`}
                      >
                        <Typography variant="button">View Profile</Typography>
                      </Button>
                      <Button
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        component={AdapterLink}
                        to={`/user/${u._id}`}
                      >
                        <Typography variant="button">Invite to Club</Typography>
                      </Button>
                      {visitProfileLoadingId === u._id && (
                        <CircularProgress className={classes.progress} />
                      )}
                    </CardActions>
                    <Avatar
                      src={u.photoUrl}
                      className={classes.userAvatarContainer}
                      style={{
                        borderColor: 'colorPrimary',
                      }}
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
