import axios from 'axios';
import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Paper,
  Tabs,
  Tab,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Club,
  ShelfEntry,
  GroupMember,
  User,
} from '@caravan/buddy-reading-types';
import { getClub } from '../../services/club';
import { getUser } from '../../services/user';
import ClubHero from './ClubHero';
import GroupView from './group-view/GroupView';
import ShelfView from './shelf-view/ShelfView';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
    progress: {
      margin: theme.spacing(2),
    },
  })
);

interface ClubRouteParams {
  id: string;
}

interface ClubProps extends RouteComponentProps<ClubRouteParams> {
  user: User | null;
}

interface MemberInfo extends User {
  role: string;
}

export default function Club(props: ClubProps) {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const [club, setClub] = React.useState<Club | null>(null);
  const [currBook, setCurrBook] = React.useState<ShelfEntry | null>(null);
  const [loadedClub, setLoadedClub] = React.useState<boolean>(false);
  const [memberInfo, setMemberInfo] = React.useState<MemberInfo | null>(null);
  const clubId = props.match.params.id;

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setTabValue(newValue);
  }

  function getCurrentBook(club: Club) {
    if (club && club.shelf) {
      const book = club.shelf.find(book => book.readingState === 'current');
      if (book) {
        setCurrBook(book);
      }
    }
  }

  function getMembersInfo(club: Club) {
    const getMembers = async () => {
      let memberInfo: Array<MemberInfo> = [];
      club.members.forEach(m => {
        try {
          getUser(m.id).then(user => {
            if (user) {
              // const member: MemberInfo = {
              //   ...user,
              //   role: m.role,
              // };
              // memberInfo.push(member);
            }
          });
        } catch (err) {
          console.error(err);
          throw err;
        }
      });
      // setMemberInfo(memberInfo);
    };
  }

  useEffect(() => {
    const getClubFun = async () => {
      try {
        const club = await getClub(clubId);
        if (club) {
          setClub(club);
          getCurrentBook(club);
          // getMemberInfo(club);
          setLoadedClub(true);
        }
      } catch (err) {
        console.error(err);
        setLoadedClub(true);
      }
    };
    getClubFun();
  }, [clubId]);

  return (
    <>
      {!loadedClub && <CircularProgress className={classes.progress} />}
      {loadedClub && club && (
        <div>
          {currBook && <ClubHero currBook={currBook} />}
          <Paper className={classes.root}>
            <Tabs
              value={tabValue}
              onChange={handleChange}
              indicatorColor="primary"
              textColor="primary"
              centered
            >
              <Tab label="Group" />
              <Tab label="Shelf" />
            </Tabs>
          </Paper>
          {tabValue === 0 && <GroupView club={club} />}
          {tabValue === 1 && <ShelfView shelf={club.shelf} />}
          <Button
            variant="contained"
            color="primary"
            className={classes.button}
          >
            JOIN CLUB
          </Button>
        </div>
      )}
      {loadedClub && !club && (
        <div>
          <Typography>Doesn't look like this club exists!</Typography>
        </div>
      )}
    </>
  );
}
