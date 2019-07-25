import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
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
        {avatarElement ? avatarElement : undefined}
      </ListItemAvatar>
      <ListItemText
        primary={primaryText ? primaryText : undefined}
        secondary={secondaryText ? secondaryText : undefined}
      />
      {secondaryElement}
    </ListItem>
  );
}
