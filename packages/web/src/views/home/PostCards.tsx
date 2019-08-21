import React from 'react';
import LazyLoad from 'react-lazyload';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import DiscordLoginModal from '../../components/DiscordLoginModal';
import { User, PostWithAuthorInfoAndLikes } from '@caravan/buddy-reading-types';
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
  postsWithAuthorInfoAndLikes: PostWithAuthorInfoAndLikes[];
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
  const {
    postsWithAuthorInfoAndLikes,
    currUser,
    showResultsCount,
    resultsLoaded,
  } = props;

  const [loginModalShown, setLoginModalShown] = React.useState(false);

  const onCloseLoginDialog = () => {
    setLoginModalShown(false);
  };

  return (
    <main>
      <Container className={classes.cardGrid} maxWidth="md">
        {showResultsCount && resultsLoaded && (
          <Typography variant="body2" color="textSecondary" gutterBottom>
            {`${postsWithAuthorInfoAndLikes.length} result${
              postsWithAuthorInfoAndLikes.length === 1 ? '' : 's'
            }`}
          </Typography>
        )}
        <Grid container spacing={4}>
          {postsWithAuthorInfoAndLikes.map(p => {
            const { post, authorInfo, likes } = p;
            const { content } = post;
            let postCard = <></>;
            if (authorInfo) {
              switch (content.postType) {
                case 'shelf':
                default:
                  postCard = (
                    <ShelfPostCard
                      postContent={content}
                      postAuthorInfo={authorInfo}
                      likes={likes}
                      postId={post._id}
                      currUser={currUser}
                      key={post._id}
                    />
                  );
                  break;
              }
            }

            return (
              <LazyLoad
                unmountIfInvisible={true}
                offset={placeholderCardHeight * lazyloadOffset}
                placeholder={
                  <Grid item key={post._id} xs={12} sm={12}>
                    <PlaceholderCard height={placeholderCardHeight} />
                  </Grid>
                }
                key={post._id}
              >
                <Grid item key={post._id} xs={12} sm={12}>
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
