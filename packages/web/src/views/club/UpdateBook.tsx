import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Typography,
  Checkbox,
  Switch,
  Button,
} from '@material-ui/core';
import { MoreVert, ArrowBack } from '@material-ui/icons';
import AdapterLink from '../../components/AdapterLink';
import Header from '../../components/Header';
import { RouteComponentProps } from 'react-router-dom';
import { User } from '@caravan/buddy-reading-types';

interface UpdateBookRouteParams {
  id: string;
}

interface UpdateBookProps extends RouteComponentProps<UpdateBookRouteParams> {
  user: User | null;
}

const useStyles = makeStyles(theme => ({
  finishedSwitchContainer: {
    display: 'flex',
    flexDirection: 'row',
    backgroundColor: 'red',
  },
  button: {
    margin: theme.spacing(1),
  },
}));

export default function UpdateBook(props: UpdateBookProps) {
  const classes = useStyles();

  const [finished, setFinished] = React.useState(true);

  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={() => props.history.goBack()}
    >
      <ArrowBack />
    </IconButton>
  );

  const centerComponent = <Typography variant="h6">Update Club</Typography>;

  const rightComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="More"
      component={AdapterLink}
      to="/"
    >
      <MoreVert />
    </IconButton>
  );

  return (
    <div>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <div>
        <Typography>Your club is currently reading:</Typography>
        <div className={classes.finishedSwitchContainer}>
          <Typography>We finished Kafka on the Shore</Typography>
          <Switch
            checked={finished}
            onChange={(event, checked) => {
              setFinished(checked);
            }}
            value="finished"
            color="primary"
            inputProps={{ 'aria-label': 'primary checkbox' }}
          />
        </div>
        <Typography>
          Here are the books in your club's Want to Read list. You can pick one
          for your next read.
        </Typography>
        <Typography>Or you can search for another book.</Typography>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={() => {}}
        >
          SAVE
        </Button>
      </div>
    </div>
  );
}
