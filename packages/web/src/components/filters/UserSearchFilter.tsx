import React from 'react';
import { ReadingSpeed, FilterChip } from '@caravan/buddy-reading-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
  Select,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../reading-speed-avatars-icons-labels';
import ListElementAvatar from '../ListElementAvatar';

const useStyles = makeStyles(() => ({
  dialogStyle: {
    padding: 0,
  },
}));

interface UserSearchFilterProps {
  filteredSpeed: FilterChip[];
  onSetSelectedSpeed: (speed: ReadingSpeed, label: string) => void;
  onClickApply: () => void;
  onClickClearFilter: () => void;
  open: boolean;
}

export default function UserSearchFilter(props: UserSearchFilterProps) {
  const classes = useStyles();

  const {
    filteredSpeed,
    onSetSelectedSpeed,
    onClickApply,
    onClickClearFilter,
    open,
  } = props;

  return (
    <Select
      native
      value={10}
      inputProps={{
        name: 'age',
        id: 'age-native-simple',
      }}
    >
      <option value={'bookTitle'}>By shelf (book title)</option>
      <option value={'bookAuthor'}>By shelf (book author)</option>
      <option value={'username'}>By username</option>
    </Select>
  );
}
