import React from 'react';
import { CircularProgress } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { User, Services } from '@caravan/buddy-reading-types';
import AdapterLink from '../../components/AdapterLink';
import theme, { makeUserTheme, makeUserDarkTheme } from '../../theme';
import GenresInCommonChips from '../../components/GenresInCommonChips';
import UserCardShelfList from '../../components/UserCardShelfList';
import { InviteToClubMenu } from '../../components/InviteToClubMenu';
import { UserWithInvitableClubs } from './Home';
import UserAvatar from '../user/UserAvatar';
import GenericGroupMemberAvatar from '../../components/misc-avatars-icons-labels/avatars/GenericGroupMemberAvatar';
import QuestionAnswer from '../../components/QuestionAnswer';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  cardGrid: {
    padding: `${theme.spacing(4)}px 8px ${theme.spacing(8)}px`,
  },
  cardContent: {
    position: 'relative',
    // zIndex: 1,
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    padding: '16px 16px 0px',
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
    marginBottom: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  userHeading: {
    position: 'relative',
    height: '96px',
    width: '100%',
  },
  userTextContainer: {
    position: 'absolute',
    width: '60%',
    bottom: 16,
    left: 16,
  },
  userNameText: {
    fontWeight: 600,
  },
  userWebsiteText: {},
  userAvatarContainer: {
    position: 'absolute',
    top: 40,
    right: 16,
    zIndex: 1,
    borderRadius: '50%',
    padding: 4,
    backgroundColor: '#FFFFFF',
  },
  fieldTitleText: {
    marginTop: theme.spacing(3),
  },
  fieldTitleTextLessTopMargin: {
    // marginTop: theme.spacing(1),
  },
  genresInCommon: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  emptyFieldText: {
    fontStyle: 'italic',
  },
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
  usersWithInvitableClubs: UserWithInvitableClubs[];
  user: User | null;
  userClubs: Services.GetClubs['clubs'];
}

export default function UserCards(props: UserCardProps) {
  const classes = useStyles();
  const { usersWithInvitableClubs, user } = props;

  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [visitProfileLoadingId] = React.useState('');
  const [inviteToClubMenuShown] = React.useState(false);

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
          {usersWithInvitableClubs.map((u, index) => {
            const userTheme = makeUserTheme(u.user.palette);
            const userDarkTheme = makeUserDarkTheme(u.user.palette);
            const otherUsersGenres: string[] = u.user.selectedGenres.map(
              x => x.name
            );
            let commonGenres = otherUsersGenres.filter(val =>
              myGenres.includes(val)
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
            const nameField: string = u.user.name || u.user.urlSlug || 'noName';

            return (
              <Grid item key={u.user._id} xs={12} sm={6}>
                <Card className={classes.card}>
                  <MuiThemeProvider theme={userTheme}>
                    <div
                      className={classes.userHeading}
                      style={{
                        backgroundColor: userTheme
                          ? userTheme.palette.primary.main
                          : theme.palette.primary.main,
                      }}
                    >
                      <div className={classes.userTextContainer}>
                        <MuiThemeProvider theme={userDarkTheme || theme}>
                          <Typography
                            variant="h5"
                            className={classes.userNameText}
                            color="primary"
                            style={
                              !userDarkTheme
                                ? {
                                    color: theme.palette.common.white,
                                  }
                                : undefined
                            }
                          >
                            {nameField}
                          </Typography>
                        </MuiThemeProvider>
                      </div>
                    </div>
                    <CardContent classes={{ root: classes.cardContent }}>
                      <Typography
                        gutterBottom
                        className={classes.fieldTitleTextLessTopMargin}
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
                      {u.user.shelf.notStarted.length > 0 && (
                        <UserCardShelfList shelf={u.user.shelf.notStarted} />
                      )}
                      {u.user.shelf.notStarted.length === 0 && (
                        <Typography
                          variant="body1"
                          className={classes.emptyFieldText}
                          color="textSecondary"
                        >
                          User has no books on their shelf...
                        </Typography>
                      )}
                      <Typography
                        className={classes.fieldTitleText}
                        color="textSecondary"
                        gutterBottom
                      >
                        {'Q & A'}
                      </Typography>
                      {u.user.questions && u.user.questions.length > 0 && (
                        <QuestionAnswer
                          key={u.user._id}
                          questionKey={u.user.questions[0].id}
                          question={u.user.questions[0].title}
                          answer={u.user.questions[0].answer}
                          numRows={2}
                          isEditing={false}
                          hideHelperText={true}
                        />
                      )}
                      {!u.user.questions ||
                        (u.user.questions.length === 0 && (
                          <>
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
                        to={{
                          pathname: `/user/${u.user._id}`,
                          state: { tabValue: 1 },
                        }}
                        variant="contained"
                      >
                        <Typography variant="button">View Profile</Typography>
                      </Button>
                      {/* <Button
                        className={classes.button}
                        color="primary"
                        variant="contained"
                        onClick={() => setInviteToClubMenuShown(true)}
                      >
                        <Typography variant="button">Invite to Club</Typography>
                      </Button> */}
                      {visitProfileLoadingId === u.user._id && (
                        <CircularProgress className={classes.progress} />
                      )}
                    </CardActions>
                    {u.user && u.user.photoUrl && (
                      <div className={classes.userAvatarContainer}>
                        <UserAvatar user={u.user} size={96} />
                      </div>
                    )}
                    {!u.user.photoUrl && (
                      <div className={classes.userAvatarContainer}>
                        <GenericGroupMemberAvatar
                          style={{ height: 96, width: 96 }}
                          iconStyle={{ height: 64, width: 64 }}
                        />
                      </div>
                    )}
                    {inviteToClubMenuShown && (
                      <InviteToClubMenu
                        user={user}
                        clubsToInviteTo={u.invitableClubs}
                        inviteClubsMenuShown={inviteToClubMenuShown}
                      />
                    )}
                  </MuiThemeProvider>
                </Card>
              </Grid>
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
