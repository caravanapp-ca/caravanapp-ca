import React from 'react';
import LazyLoad from 'react-lazyload';
import { CircularProgress, Link } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles, MuiThemeProvider } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { User, UserWithInvitableClubs } from '@caravanapp/buddy-reading-types';
import AdapterLink from '../../components/AdapterLink';
import theme, { makeUserTheme, makeUserDarkTheme } from '../../theme';
import GenresInCommonChips from '../../components/GenresInCommonChips';
import UserCardShelfList from '../../components/UserCardShelfList';
import { InviteToClubMenu } from '../../components/InviteToClubMenu';
import UserAvatar from '../user/UserAvatar';
import GenericGroupMemberAvatar from '../../components/misc-avatars-icons-labels/avatars/GenericGroupMemberAvatar';
import QuestionAnswer from '../../components/QuestionAnswer';
import { OwnProfileCardActions } from '../../components/OwnProfileCardActions';
import PlaceholderCard from '../../components/PlaceholderCard';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  cardGrid: {
    padding: `${theme.spacing(4)}px 16px ${theme.spacing(8)}px`,
  },
  cardContent: {
    position: 'relative',
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
  genresInCommon: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  emptyFieldText: {
    fontStyle: 'italic',
  },
  progress: {
    margin: theme.spacing(2),
  },
  buttonsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

interface UserCardProps {
  usersWithInvitableClubs: UserWithInvitableClubs[];
  currUser: User | null;
  showResultsCount?: boolean;
  resultsLoaded?: boolean;
}

// Make this approximately the height of a standard UserCard
const placeholderCardHeight = 588;
// The number of cards above and below the current to load
const lazyloadOffset = 4;

export default function UserCards(props: UserCardProps) {
  const classes = useStyles();
  const {
    usersWithInvitableClubs,
    currUser,
    showResultsCount,
    resultsLoaded,
  } = props;

  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [visitProfileLoadingId] = React.useState('');

  const onCloseLoginDialog = () => {
    setLoginModalShown(false);
  };

  // TODO: Going to move this outside
  let myGenres: string[] = [];
  if (currUser) {
    myGenres = currUser.selectedGenres.map(x => x.name);
  }

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        {showResultsCount && resultsLoaded && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {`${usersWithInvitableClubs.length} result${
              usersWithInvitableClubs.length === 1 ? '' : 's'
            }`}
          </Typography>
        )}
        <Grid container spacing={4}>
          {usersWithInvitableClubs.map(u => {
            const {
              _id,
              name,
              palette,
              photoUrl,
              questions,
              selectedGenres,
              shelf,
              urlSlug,
            } = u.user;
            const userTheme = makeUserTheme(palette);
            const userDarkTheme = makeUserDarkTheme(palette);
            const otherUsersGenres: string[] = selectedGenres.map(x => x.name);
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
            const nameField: string = name || urlSlug || 'noName';

            return (
              <LazyLoad
                unmountIfInvisible={true}
                offset={placeholderCardHeight * lazyloadOffset}
                key={_id}
                placeholder={
                  <Grid item key={_id} xs={12} sm={6}>
                    <PlaceholderCard height={placeholderCardHeight} />
                  </Grid>
                }
              >
                <Grid item key={_id} xs={12} sm={6}>
                  <Card className={classes.card}>
                    <MuiThemeProvider theme={userTheme || theme}>
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
                            <Link
                              href={`/user/${urlSlug}`}
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
                            </Link>
                          </MuiThemeProvider>
                        </div>
                      </div>
                      <CardContent classes={{ root: classes.cardContent }}>
                        <Typography gutterBottom color="textSecondary">
                          Genres
                        </Typography>
                        {otherUsersGenres.length > 0 && (
                          <div className={classes.genresInCommon}>
                            {commonGenres.map(genre => (
                              <GenresInCommonChips
                                key={genre}
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
                                key={genre}
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
                          To be Read
                        </Typography>
                        {shelf.notStarted.length > 0 && (
                          <UserCardShelfList shelf={shelf.notStarted} />
                        )}
                        {shelf.notStarted.length === 0 && (
                          <Typography
                            variant="body1"
                            className={classes.emptyFieldText}
                            // This margin makes the spacing even with the QuestionAnswer component.
                            style={{ marginBottom: 8 }}
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
                        {questions && questions.length > 0 && (
                          <QuestionAnswer
                            key={_id}
                            questionKey={questions[0].id}
                            question={questions[0].title}
                            answer={questions[0].answer}
                            numRows={2}
                            rowsMax={4}
                            isEditing={false}
                            hideHelperText={true}
                          />
                        )}
                        {!questions ||
                          (questions.length === 0 && (
                            <>
                              <Typography
                                variant="body1"
                                className={classes.emptyFieldText}
                                color="textSecondary"
                              >
                                User hasn't answered any profile questions
                                yet...
                              </Typography>
                            </>
                          ))}
                      </CardContent>
                      <CardActions classes={{ root: classes.cardActions }}>
                        {(!currUser || currUser._id !== _id) && (
                          <div className={classes.buttonsContainer}>
                            <Button
                              className={classes.button}
                              color="primary"
                              component={AdapterLink}
                              to={`/user/${urlSlug}`}
                            >
                              <Typography variant="button">
                                View Profile
                              </Typography>
                            </Button>
                            <InviteToClubMenu
                              clubsToInviteTo={u.invitableClubs}
                              loggedInUser={currUser}
                              userToInvite={u.user}
                            />
                          </div>
                        )}
                        {currUser && currUser._id === _id && (
                          <OwnProfileCardActions user={currUser} />
                        )}
                        {visitProfileLoadingId === _id && (
                          <CircularProgress className={classes.progress} />
                        )}
                      </CardActions>
                      <Link href={`/user/${urlSlug}`}>
                        {u.user && photoUrl && (
                          <div className={classes.userAvatarContainer}>
                            <UserAvatar user={u.user} size={96} />
                          </div>
                        )}
                        {!photoUrl && (
                          <div className={classes.userAvatarContainer}>
                            <GenericGroupMemberAvatar
                              style={{ height: 96, width: 96 }}
                              iconStyle={{ height: 64, width: 64 }}
                            />
                          </div>
                        )}
                      </Link>
                    </MuiThemeProvider>
                  </Card>
                </Grid>
              </LazyLoad>
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
