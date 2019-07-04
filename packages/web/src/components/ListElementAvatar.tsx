import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/icons/Person';
import AdapterLink from './AdapterLink';

export interface ListElementAvatarProps {
  avatarElement?: any;
  primaryElement?: JSX.Element;
  secondaryElement?: JSX.Element;
  primaryText?: string;
  secondaryText?: string;
  button?: boolean;
  link?: string;
}

export default function ListElementAvatar(props: ListElementAvatarProps) {
  const {
    avatarElement,
    primaryElement,
    secondaryElement,
    primaryText,
    secondaryText,
    button,
    link,
  } = props;

  return (
    <ListItem
      // @ts-ignore
      button={button && link ? button : undefined}
      component={button && link ? AdapterLink : undefined}
      to={button && link ? link : undefined}
    >
      {primaryElement}
      <ListItemAvatar>
        {avatarElement ? (
          avatarElement
        ) : (
          <Avatar>
            <PersonIcon />
          </Avatar>
        )}
      </ListItemAvatar>
      <ListItemText
        primary={primaryText ? primaryText : 'Group member'}
        secondary={secondaryText ? secondaryText : null}
      />
      {secondaryElement}
    </ListItem>
  );
}
