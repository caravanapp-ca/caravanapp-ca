import React, { useEffect } from 'react';
import { Paper, Tabs, Tab, Button, Typography } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { RouteComponentProps } from 'react-router-dom';
import { ClubDoc, ShelfEntryDoc } from '@caravan/buddy-reading-types';
import ClubHero from './ClubHero';
import GroupView from './group-view/GroupView';
import ShelfView from './shelf-view/ShelfView';
import axios from 'axios';

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
  })
);

type ClubRouteParams = { id: string };

export default function Club({ match }: RouteComponentProps<ClubRouteParams>) {
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const [club, setClub] = React.useState<ClubDoc | null>(null);
  const [currBook, setCurrBook] = React.useState<ShelfEntryDoc | null>(null);
  const [loadedClub, setLoadedClub] = React.useState<boolean>(false);
  const clubId = match.params.id;

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setTabValue(newValue);
  }

  function getCurrentBook(club: ClubDoc){
    if(club && club.shelf){
      const book = club.shelf.find(book => book.readingState === 'current');
      if (book) {
        setCurrBook(book)
      }
    }
  }

  useEffect(() => {
    const getClub = async () => {
      try {
        const result = await axios.get<ClubDoc>(`/api/club/${clubId}`); //TODO: type as ClubDoc
        const club = result.data;
        setClub(club);
        getCurrentBook(club);
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
      {loadedClub && club && (
        <div>
          {currBook &&
            <ClubHero
              currBook={currBook}
            />
          }
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
          {tabValue === 0 &&
            <GroupView
              club={club}
            />
          }
          {tabValue === 1 &&
            <ShelfView
              shelf={club.shelf}
            />
          }
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
