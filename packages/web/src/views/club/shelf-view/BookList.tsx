import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListElementAvatar from '../../../components/ListElementAvatar';
import Avatar from '@material-ui/core/Avatar';

const useStyles = makeStyles((theme: Theme) => createStyles({}));

export default function BookList() {
  return (
    <List dense={false}>
      <ListElementAvatar
        avatarElement={
          <Avatar
            alt="Cover of The Name of the Wind"
            src={require('./186074.jpg')}
          />
        }
        primaryText="The Name of the Wind"
      />
    </List>
  );
}
