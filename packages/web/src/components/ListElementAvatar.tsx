import React from 'react'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';

export interface ListElementAvatarProps {
  avatarElement?: any,
  primaryText?: string,
  secondaryText?: string,
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
  }),
);

export default function ListElementAvatar(props: ListElementAvatarProps) {

  const classes = useStyles();

  const { avatarElement, primaryText, secondaryText } = props;

  return (
    <ListItem button>
      <ListItemAvatar>
        {avatarElement ? avatarElement : <FolderIcon />}
      </ListItemAvatar>
      <ListItemText
        primary={primaryText? primaryText : 'Group member'}
        secondary={secondaryText ? secondaryText : null}
      />
    </ListItem>
  )
}
