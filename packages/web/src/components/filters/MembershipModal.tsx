import React from 'react';
import { Capacity, FilterChip, Membership } from '@caravan/buddy-reading-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
  ListItem,
  ListItemText,
  Radio,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import theme from '../../theme';
import { capacityLabels } from '../capacity-labels';
import { membershipLabels } from '../membership-labels';

const useStyles = makeStyles(theme => ({
  dialogStyle: {
    padding: 0,
  },
}));

interface MembershipModalProps {
  filteredMemberships: FilterChip[];
  onMembershipSelected: (membership: Membership, label: string) => void;
  onClickApply: () => void;
  onClickClearFilter: () => void;
  open: boolean;
}

export default function MembershipModal(props: MembershipModalProps) {
  const classes = useStyles();

  const {
    filteredMemberships,
    onMembershipSelected,
    onClickApply,
    onClickClearFilter,
    open,
  } = props;

  const memberships: Membership[] = ['myClubs', 'clubsImNotIn'];

  let selectedMembership = '';
  if (filteredMemberships.length > 0) {
    selectedMembership = filteredMemberships[0].key;
  }

  return (
    <Dialog open={open} onClose={onClickApply}>
      <DialogTitle id="membership-dialog-title">
        Filter Clubs by Membership
      </DialogTitle>
      <DialogContent classes={{ root: classes.dialogStyle }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
          }}
        >
          {memberships.map(membership => {
            const label = membershipLabels(membership);
            return (
              <ListItem key={membership}>
                <Radio
                  checked={membership === selectedMembership}
                  onChange={() => onMembershipSelected(membership, label)}
                  value={membership}
                  name={`radio-box-${membership}`}
                  color="primary"
                  style={{ marginRight: theme.spacing(2) }}
                />
                <ListItemText
                  primary={label}
                  secondary={membershipLabels(membership, 'description')}
                />
              </ListItem>
            );
          })}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClickClearFilter}
          disabled={filteredMemberships.length === 0}
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
