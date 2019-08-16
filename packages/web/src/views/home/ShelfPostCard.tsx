import React from 'react';
import { Link } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import {
  ShelfPost,
  PostUserInfo,
  PostContent,
} from '@caravan/buddy-reading-types';
import theme from '../../theme';
import Truncate from 'react-truncate';
import ShelfPostCardShelfList from '../../components/ShelfPostCardShelfList';

const useStyles = makeStyles(theme => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
  },
  clubTitle: {
    fontWeight: 600,
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

interface ShelfPostCardProps {
  postContent: PostContent;
  userInfo: PostUserInfo;
}

export default function ShelfPostCard(props: ShelfPostCardProps) {
  const classes = useStyles();
  const { postContent, userInfo } = props;
  const shelfPost = postContent as ShelfPost;
  const [, setLoginModalShown] = React.useState(false);
  const [] = React.useState('');

  const nameField: string = userInfo.name || userInfo.urlSlug || 'Caravan User';

  console.log('Shelf post');
  console.log(shelfPost);

  return (
    <>
      <Card className={classes.card}>
        <div
          className={classes.userHeading}
          style={{
            backgroundColor: theme.palette.primary.main,
          }}
        >
          <div className={classes.userTextContainer}>
            <Link
              href={`/user/${userInfo.urlSlug}`}
              variant="h5"
              className={classes.userNameText}
              color="primary"
              style={{
                color: theme.palette.common.white,
              }}
            >
              {nameField}
            </Link>
          </div>
        </div>
        <CardContent classes={{ root: classes.cardContent }}>
          <Typography
            gutterBottom
            variant="h5"
            component="h2"
            className={classes.clubTitle}
          >
            <Truncate lines={2} trimWhitespace={true}>
              {shelfPost.title}
            </Truncate>
          </Typography>
          {shelfPost.shelf.length > 0 && (
            <ShelfPostCardShelfList shelf={shelfPost.shelf} />
          )}
        </CardContent>
      </Card>
    </>
  );
}
