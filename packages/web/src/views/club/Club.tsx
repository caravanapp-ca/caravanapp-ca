import React, { useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import {
  Club,
  MemberInfo,
  ShelfEntry,
  User,
} from '@caravan/buddy-reading-types';
import {
  Paper,
  Tabs,
  Tab,
  Button,
  Typography,
  CircularProgress,
} from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { getClub } from '../../services/club';
import { getUsersById } from '../../services/user';
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

export default function ClubComponent(props: ClubProps) {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const [club, setClub] = React.useState<Club | null>(null);
  const [currBook, setCurrBook] = React.useState<ShelfEntry | null>(null);
  const [loadedClub, setLoadedClub] = React.useState<boolean>(false);
  const [memberInfo, setMemberInfo] = React.useState<MemberInfo[]>([]);
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

  async function getMembersInfo(club: Club) {
    if (club && club.members) {
      const memberIds = club.members.map(m => m.userId);
      const users = await getUsersById(memberIds);
      if (users) {
        const membersWithInfo = users.map(u => {
          const member = club.members.find(m => m.userId === u._id);
          if (!member) {
            throw Error('Should not happen');
          }
          return { ...u, role: member.role };
        });
        setMemberInfo(membersWithInfo);
      }
    }
  }

  useEffect(() => {
    const getClubFun = async () => {
      try {
        const club = await getClub(clubId);
        if (club) {
          setClub(club);
          getCurrentBook(club);
          getMembersInfo(club);
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
          {tabValue === 0 && <GroupView club={club} memberInfo={memberInfo} />}
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
          <Typography>It does not appear that this club exists!</Typography>
        </div>
      )}
    </>
  );
}
