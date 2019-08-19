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
import {
  User,
  UserWithInvitableClubs,
  Post,
  ShelfPost,
  PostContent,
} from '@caravan/buddy-reading-types';
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
import ShelfPostCard from './ShelfPostCard';

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

interface PostCardProps {
  posts: Post[];
  currUser: User | null;
  showResultsCount?: boolean;
  resultsLoaded?: boolean;
}

// Make this approximately the height of a standard UserCard
const placeholderCardHeight = 588;
// The number of cards above and below the current to load
const lazyloadOffset = 4;

export default function PostCards(props: PostCardProps) {
  const classes = useStyles();
  const { posts, currUser, showResultsCount, resultsLoaded } = props;

  const [loginModalShown, setLoginModalShown] = React.useState(false);
  const [visitProfileLoadingId] = React.useState('');

  const onCloseLoginDialog = () => {
    setLoginModalShown(false);
  };

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        {showResultsCount && resultsLoaded && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {`${posts.length} result${posts.length === 1 ? '' : 's'}`}
          </Typography>
        )}
        <Grid container spacing={4}>
          {posts.map(p => {
            const { content, userInfo } = p;
            let postCard = <></>;
            switch (content.postType) {
              case 'shelf':
              default:
                postCard = (
                  <ShelfPostCard
                    postContent={content}
                    userInfo={userInfo}
                    postId={p._id}
                    currUser={currUser}
                    key={p._id}
                  />
                );
                break;
            }

            return (
              <LazyLoad
                unmountIfInvisible={true}
                offset={placeholderCardHeight * lazyloadOffset}
                placeholder={
                  <Grid item key={p._id} xs={12} sm={12}>
                    <PlaceholderCard height={placeholderCardHeight} />
                  </Grid>
                }
                key={p._id}
              >
                <Grid item key={p._id} xs={12} sm={12}>
                  {postCard}
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
