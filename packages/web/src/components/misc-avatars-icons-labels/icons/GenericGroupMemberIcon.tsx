import React from 'react';
import { Person } from '@material-ui/icons';
import { SvgIconProps } from '@material-ui/core/SvgIcon';

export default function GenericGroupMemberIcon(props: SvgIconProps) {
  return <Person {...props} />;
}
