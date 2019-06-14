import React from 'react';
import { Typography } from '@material-ui/core'
import MemberList from './MemberList'

export default function GroupView() {
  return (
    <div>
      <Typography>About the Group</Typography>
      <Typography>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed ut convallis ligula. Fusce eget sollicitudin massa. Vestibulum sodales purus a turpis convallis, eget lacinia tellus ultrices. Nullam nulla augue, feugiat volutpat pulvinar dapibus, tristique id.
      </Typography>
      <Typography>Members</Typography>
      <MemberList/>
      <Typography>Reading Speed</Typography>
      <Typography>Vibe</Typography>
    </div>
  )
}
