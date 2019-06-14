import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListElementAvatar from '../../../components/ListElementAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

export default function MemberList() {

  const classes = useStyles();
  const [dense] = React.useState(false);

  return (
    <List dense={dense}>
      <ListElementAvatar
        avatarElement={<Avatar alt="MR Urner" src={require("./56624593_10219238571019732_3709471302600359936_o.jpg")} />}
        primaryText='Quinn Turner'
        secondaryText='Test'
      />
    </List>
  );
}
