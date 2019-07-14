import React from 'react';
import { ReadingSpeed, FilterChip } from '@caravan/buddy-reading-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
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

interface ReadingSpeedModalProps {
  filteredSpeed: FilterChip[];
  onSetSelectedSpeed: (speed: ReadingSpeed, label: string) => void;
  onClickApply: () => void;
  onClickClearFilter: () => void;
  open: boolean;
}

export default function ReadingSpeedModal(props: ReadingSpeedModalProps) {
  const classes = useStyles();

  const {
    filteredSpeed,
    onSetSelectedSpeed,
    onClickApply,
    onClickClearFilter,
    open,
  } = props;

  const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];

  let selectedSpeed = '';
  if (filteredSpeed.length > 0) {
    selectedSpeed = filteredSpeed[0].key;
  }

  return (
    <Dialog open={open} onClose={onClickApply}>
      <DialogTitle id="alert-dialog-title">
        Filter Clubs by Reading Speed
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogStyle }}>
        <div>
          {readingSpeeds.map(speed => {
            const label = readingSpeedLabels(speed);
            return (
              <ListElementAvatar
                key={speed}
                primaryElement={
                  <Radio
                    checked={speed === selectedSpeed}
                    onChange={() => onSetSelectedSpeed(speed, label)}
                    value={speed}
                    name={`radio-button-${speed}`}
                    color="primary"
                  />
                }
                avatarElement={readingSpeedIcons(speed, 'avatar')}
                primaryText={label}
                secondaryText={readingSpeedLabels(speed, 'description')}
              />
            );
          })}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClickClearFilter} color="primary">
          CLEAR
        </Button>
        <Button variant="contained" onClick={onClickApply} color="primary">
          APPLY
        </Button>
      </DialogActions>
    </Dialog>
  );
}
