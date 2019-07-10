import React from 'react';
import { Capacity, FilterChip } from '@caravan/buddy-reading-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItem,
  ListItemText,
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
  onCapacitySelected: (capacity: Capacity, selected: boolean) => void;
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

  const capacities: Capacity[] = [
    'full',
    'spotsAvailable',
    'clubsImIn',
    'clubsIOwn',
  ];

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
            const capacityChecked = filteredCapacities
              .map(c => c.key)
              .includes(capacity);
            return (
              <ListItem key={capacity}>
                <Checkbox
                  checked={capacityChecked}
                  onChange={() =>
                    onCapacitySelected(capacity, !capacityChecked)
                  }
                  value={capacity}
                  name={`check-box-${capacity}`}
                  color="primary"
                  style={{ marginRight: theme.spacing(2) }}
                />
                <ListItemText
                  primary={capacityLabels(capacity)}
                  secondary={capacityLabels(capacity, 'description')}
                />
              </ListItem>
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
