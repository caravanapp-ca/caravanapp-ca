import React from 'react';

import { SvgIconProps } from '@material-ui/core';
import { Person } from '@material-ui/icons';

export default function GenericGroupMemberIcon(props: SvgIconProps) {
  return <Person {...props} />;
}
