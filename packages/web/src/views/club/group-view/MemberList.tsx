import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListElementAvatar from '../../../components/ListElementAvatar';
import Avatar from '@material-ui/core/Avatar';
import { GroupMember } from '@caravan/buddy-reading-types';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

interface MemberListProps {
  members: GroupMember[];
  maxMembers: number;
}

export default function MemberList(props: MemberListProps) {
  const classes = useStyles();

  return (
    <List dense={false}>
      <ListElementAvatar
        avatarElement={
          <Avatar
            alt="MR. Urner"
            src={require('./56624593_10219238571019732_3709471302600359936_o.jpg')}
          />
        }
        primaryText="Quinn Turner"
      />
    </List>
  );
}
