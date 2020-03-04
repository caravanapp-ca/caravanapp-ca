import React, { SyntheticEvent } from 'react';

import { Snackbar } from '@material-ui/core';

import MySnackbarContentWrapper, {
  variantIcon,
} from './MySnackbarContentWrapper';

export interface CustomSnackbarProps {
  autoHideDuration: number;
  isOpen: boolean;
  variant: keyof typeof variantIcon;
  handleClose: (event?: SyntheticEvent, reason?: string) => void;
  message?: string;
}

export default function CustomSnackbar(props: CustomSnackbarProps) {
  const { autoHideDuration, isOpen, variant, handleClose, message } = props;
  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
      open={isOpen}
      autoHideDuration={autoHideDuration}
      onClose={handleClose}
    >
      <MySnackbarContentWrapper
        variant={variant}
        handleClose={handleClose}
        message={message}
      />
    </Snackbar>
  );
}
