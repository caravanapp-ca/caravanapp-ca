import React, { useEffect } from 'react';
import { Link, CardActions } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {
  ShelfPost,
  PostUserInfo,
  PostContent,
  User,
  Likes,
  Like,
  FilterAutoMongoKeys,
  ClubReadingSchedule,
} from '@caravan/buddy-reading-types';
import theme from '../../theme';
import Truncate from 'react-truncate';
import ShelfPostCardShelfList from '../../components/ShelfPostCardShelfList';
import PostHeader from '../../components/PostHeader';
import shelfIcon from '../../resources/post-icons/shelf_icon.svg';
import PostActions from '../../components/PostActions';
import GenresInCommonChips from '../../components/GenresInCommonChips';
import { getPostLikes, modifyPostLike } from '../../services/like';
import { Service } from '../../common/service';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  shelfTitle: {
    fontWeight: 600,
    marginTop: theme.spacing(2.5),
  },
  shelfDescription: {},
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
  cardActions: {},
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

interface ShelfPostCardProps {
  postContent: PostContent;
  postAuthorInfo: PostUserInfo;
  likes: PostUserInfo[];
  postId: string;
  currUser: User | null;
}

export default function ShelfPostCard(props: ShelfPostCardProps) {
  const classes = useStyles();
  const { postContent, postAuthorInfo, likes, postId, currUser } = props;
  const shelfPost = postContent as ShelfPost;

  const [hasLikedPost, setHasLikedPost] = React.useState<boolean>(false);

  // useEffect(() => {
  //   if (!postId) {
  //     return;
  //   }
  //   (async () => {
  //     const response = await getPostLikes(postId);
  //     if (response.status >= 200 && response.status < 204) {
  //       const { data } = response;
  //       const likes: string[] = data.likes;
  //       const likesObj: FilterAutoMongoKeys<Likes> = {
  //         likes,
  //       };
  //       setPostLikes({
  //         status: 'loaded',
  //         payload: likesObj,
  //       });
  //       if (currUser && currUser._id) {
  //         likesObj.likes.map(l => {
  //           if (l === currUser._id) {
  //             setHasLikedPost(true);
  //           }
  //         });
  //       }
  //     } else {
  //       const emptyLikesArr: string[] = [];
  //       const emptyLikesObj: FilterAutoMongoKeys<Likes> = {
  //         likes: emptyLikesArr,
  //       };
  //       setPostLikes({
  //         status: 'loaded',
  //         payload: emptyLikesObj,
  //       });
  //     }
  //   })();
  // }, [postId]);

  async function handleLikeAction() {
    if (currUser) {
      const likesUserIds: string[] = likes.map(l => l.userId);
      await modifyPostLike(currUser, postId, hasLikedPost, likesUserIds);
      setHasLikedPost(!hasLikedPost);
    }
  }

  let myGenres: string[] = [];
  if (currUser) {
    myGenres = currUser.selectedGenres.map(x => x.name);
  }
  let shelfGenres: string[] = [];
  let nonSharedShelfGenres: string[] = [];
  let commonGenres: string[] = [];
  if (shelfPost && shelfPost.genres && shelfPost.genres.length > 0) {
    shelfGenres = shelfPost.genres.map(g => g.name);
    commonGenres = shelfGenres.filter(val => myGenres.includes(val));
    commonGenres = commonGenres.slice(0, Math.min(commonGenres.length, 5));
    if (commonGenres.length < 5) {
      nonSharedShelfGenres = shelfGenres.filter(val => !myGenres.includes(val));
      nonSharedShelfGenres = nonSharedShelfGenres.slice(
        0,
        Math.min(5 - commonGenres.length, 5)
      );
    }
  }

  return (
    <>
      <Card className={classes.card}>
        <PostHeader
          postAuthorInfo={postAuthorInfo}
          iconColor={'#64B5F6'}
          postIcon={shelfIcon}
        />
        <CardContent classes={{ root: classes.cardContent }}>
          {shelfPost.shelf.length > 0 && (
            <ShelfPostCardShelfList shelf={shelfPost.shelf} />
          )}
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={classes.shelfTitle}
          >
            <Truncate lines={2} trimWhitespace={true}>
              {shelfPost.title}
            </Truncate>
          </Typography>
          <Typography
            gutterBottom
            variant="subtitle1"
            component="h2"
            className={classes.shelfDescription}
          >
            <Truncate lines={2} trimWhitespace={true}>
              {shelfPost.description}
            </Truncate>
          </Typography>
          {shelfGenres.length > 0 && (
            <div className={classes.genresInCommon}>
              {commonGenres.map(genre => (
                <GenresInCommonChips
                  name={genre}
                  backgroundColor={theme.palette.primary.main}
                  common={true}
                  key={genre}
                />
              ))}
              {nonSharedShelfGenres.map(genre => (
                <GenresInCommonChips
                  name={genre}
                  backgroundColor={theme.palette.primary.main}
                  common={false}
                  key={genre}
                />
              ))}
            </div>
          )}
        </CardContent>
        <CardActions className={classes.cardActions}>
          <PostActions
            postId={postId}
            likes={likes}
            hasLikedPost={hasLikedPost}
            onClickLike={handleLikeAction}
          />
        </CardActions>
      </Card>
    </>
  );
}
