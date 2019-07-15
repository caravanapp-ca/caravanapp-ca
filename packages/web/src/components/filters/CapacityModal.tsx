import React from 'react';
import { Capacity, FilterChip } from '@caravan/buddy-reading-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  ListItem,
  ListItemText,
  Radio,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import theme from '../../theme';
import { capacityLabels } from '../capacity-labels';

const useStyles = makeStyles(theme => ({
  dialogStyle: {
    padding: 0,
  },
}));

interface CapacityModalProps {
  filteredCapacities: FilterChip[];
  onCapacitySelected: (capacity: Capacity, label: string) => void;
  onClickApply: () => void;
  onClickClearFilter: () => void;
  open: boolean;
}

export default function CapacityModal(props: CapacityModalProps) {
  const classes = useStyles();

  const {
    filteredCapacities,
    onCapacitySelected,
    onClickApply,
    onClickClearFilter,
    open,
  } = props;

  const capacities: Capacity[] = ['full', 'spotsAvailable'];
  // TODO add filters 'clubsImIn','clubsIOwn',

  let selectedCapacity = '';
  if (filteredCapacities.length > 0) {
    selectedCapacity = filteredCapacities[0].key;
  }

  return (
    <Dialog open={open} onClose={onClickApply}>
      <DialogTitle color={theme.palette.primary.main} id="alert-dialog-title">
        Filter Clubs by Capacity
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogStyle }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          {capacities.map(capacity => {
            const label = capacityLabels(capacity);
            return (
              <ListItem key={capacity}>
                <Radio
                  checked={capacity === selectedCapacity}
                  onChange={() => onCapacitySelected(capacity, label)}
                  value={capacity}
                  name={`radio-box-${capacity}`}
                  color="primary"
                  style={{ marginRight: theme.spacing(2) }}
                />
                <ListItemText
                  primary={label}
                  secondary={capacityLabels(capacity, 'description')}
                />
              </ListItem>
            );
          })}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClickClearFilter}
          disabled={filteredCapacities.length === 0}
          color="primary"
        >
          CLEAR
        </Button>
        <Button variant="contained" onClick={onClickApply} color="primary">
          APPLY
        </Button>
      </DialogActions>
    </Dialog>
  );
}
