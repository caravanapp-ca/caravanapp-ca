import React from 'react';

import {
  createStyles,
  makeStyles,
  Switch,
  Typography,
} from '@material-ui/core';

import {
  CLUB_SIZE_NO_LIMIT_LABEL,
  CLUB_SIZES,
} from '../common/globalConstants';
import GroupSizeSelector from './GroupSizeSelector';

const useStyles = makeStyles(() =>
  createStyles({
    centeredColumnContainer: {
      display: 'flex',
      width: '100%',
      flexDirection: 'column',
      alignItems: 'center',
    },
    twoLabelSwitchContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
  })
);

interface ClubMemberLimitEditorProps {
  handleGroupLimitSwitch: (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => void;
  handleGroupSizeChange: (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>,
    child: React.ReactNode
  ) => void;
  limitGroupSize: boolean;
  numMembers: number;
  selectedGroupSize: number;
}

export default function ClubMemberLimitEditor(
  props: ClubMemberLimitEditorProps
) {
  const {
    handleGroupLimitSwitch,
    handleGroupSizeChange,
    limitGroupSize,
    numMembers,
    selectedGroupSize,
  } = props;
  const classes = useStyles();
  return (
    <div className={classes.centeredColumnContainer}>
      <div className={classes.twoLabelSwitchContainer}>
        <Typography>Unlimited</Typography>
        <Switch
          checked={limitGroupSize}
          onChange={handleGroupLimitSwitch}
          color="primary"
        />
        <Typography>Limited</Typography>
      </div>
      <GroupSizeSelector
        onChangeSize={handleGroupSizeChange}
        selectedSize={
          !limitGroupSize
            ? CLUB_SIZE_NO_LIMIT_LABEL
            : selectedGroupSize.toString()
        }
        sizes={CLUB_SIZES.map(str => ({
          label: str,
          enabled:
            str === CLUB_SIZE_NO_LIMIT_LABEL || numMembers <= parseInt(str),
        }))}
        disabled={!limitGroupSize}
      />
    </div>
  );
}
