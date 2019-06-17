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
  ClubDoc,
  ShelfEntryDoc,
  UserDoc,
  GroupMemberDoc,
} from '@caravan/buddy-reading-types';
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
  user: UserDoc | null;
}

export default function Club(props: ClubProps) {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const [club, setClub] = React.useState<ClubDoc | null>(null);
  const [currBook, setCurrBook] = React.useState<ShelfEntryDoc | null>(null);
  const [loadedClub, setLoadedClub] = React.useState<boolean>(false);
  // const [memberInfo, setMemberInfo] = React.useState<MemberInfo | null>(null);
  const clubId = props.match.params.id;

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setTabValue(newValue);
  }

  function getCurrentBook(club: ClubDoc) {
    if (club && club.shelf) {
      const book = club.shelf.find(book => book.readingState === 'current');
      if (book) {
        setCurrBook(book);
      }
    }
  }

  // WIP
  // function getMembersInfo(club: ClubDoc) {
  //   const getMembers = async () => {
  //     let memberInfo = [];
  //     club.members.forEach(m => {
  //       try {
  // TODO: Need to move this axios call to services.
  //         const result = await axios.get<UserDoc>(`/api/user/${m.id}`);
  //         const member = result.data;
  //         memberInfo.push({ member, role: m.role });
  //       } catch (err) {
  //         console.error(err);
  //       }
  //     });
  //     setMemberInfo(memberInfo);
  //   };
  // }

  useEffect(() => {
    const getClub = async () => {
      try {
        // TODO: Need to move this axios call to services.
        const result = await axios.get<ClubDoc>(`/api/club/${clubId}`);
        const club = result.data;
        setClub(club);
        getCurrentBook(club);
        // getMemberInfo(club);
        setLoadedClub(true);
      } catch (err) {
        console.error(err);
        setLoadedClub(true);
      }
    };
    getClub();
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
