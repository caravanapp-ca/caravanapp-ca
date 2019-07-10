import React from 'react';
import {
  Services,
  SelectedGenre,
  ReadingSpeed,
} from '@caravan/buddy-reading-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Radio,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GenreChip from '../../components/GenreChip';
import theme from '../../theme';
import {
  readingSpeedIcons,
  readingSpeedLabels,
} from '../reading-speed-avatars-icons-labels';
import ListElementAvatar from '../ListElementAvatar';

interface ReadingSpeedModalProps {
  filteredSpeed: ReadingSpeed | 'any';
  onSetSelectedSpeed: (speed: ReadingSpeed | 'any') => void;
  onClickApply: () => void;
  onClickClearFilter: () => void;
  open: boolean;
}

export default function ReadingSpeedModal(props: ReadingSpeedModalProps) {
  const {
    filteredSpeed,
    onSetSelectedSpeed,
    onClickApply,
    onClickClearFilter,
    open,
  } = props;

  const readingSpeeds: ReadingSpeed[] = ['fast', 'moderate', 'slow'];

  return (
    <Dialog open={open} onClose={onClickApply}>
      <DialogTitle color={theme.palette.primary.main} id="alert-dialog-title">
        Filter Clubs by Genre
      </DialogTitle>
      <DialogContent>
        <div>
          {readingSpeeds.map(speed => (
            <ListElementAvatar
              key={speed}
              primaryElement={
                <Radio
                  checked={filteredSpeed === speed}
                  onChange={() => onSetSelectedSpeed(speed)}
                  value={speed}
                  name={`radio-button-${speed}`}
                  color="primary"
                />
              }
              avatarElement={readingSpeedIcons(speed, 'avatar')}
              primaryText={readingSpeedLabels(speed)}
              secondaryText={readingSpeedLabels(speed, 'description')}
            />
          ))}
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
