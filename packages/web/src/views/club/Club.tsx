import React, { Fragment } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ClubHero from './ClubHero';
import GroupView from './group-view/GroupView';
import ShelfView from './shelf-view/ShelfView';
import { Paper, Tabs, Tab, Button } from '@material-ui/core';

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
  }),
);

export default function Club() {

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  function handleChange(event: React.ChangeEvent<{}>, newValue: number) {
    setValue(newValue);
  }

  return (
    <div>
      <ClubHero/>
      <Paper className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          <Tab label="Group" />
          <Tab label="Shelf" />
        </Tabs>
      </Paper>
      {value === 0 &&
        <GroupView/>
      }
      {value === 1 &&
        <ShelfView/>
      }
      <Button variant="contained" color="primary" className={classes.button}>
        JOIN CLUB
      </Button>
    </div>
  )
}
