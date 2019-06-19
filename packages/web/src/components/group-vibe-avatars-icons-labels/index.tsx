import React from 'react';
import { GroupVibe } from '@caravan/buddy-reading-types';
import ChillGroupVibeAvatar from './group-vibe-avatars/ChillGroupVibeAvatar';
import FirstTimersGroupVibeAvatar from './group-vibe-avatars/FirstTimersGroupVibeAvatar';
import LearningGroupVibeAvatar from './group-vibe-avatars/LearningGroupVibeAvatar';
import PowerGroupVibeAvatar from './group-vibe-avatars/PowerGroupVibeAvatar';
import NerdyGroupVibeAvatar from './group-vibe-avatars/NerdyGroupVibeAvatar';
import ChillGroupVibeIcon from './group-vibe-icons/ChillGroupVibeIcon';
import FirstTimersGroupVibeIcon from './group-vibe-icons/FirstTimersGroupVibeIcon';
import LearningGroupVibeIcon from './group-vibe-icons/LearningGroupVibeIcon';
import PowerGroupVibeIcon from './group-vibe-icons/PowerGroupVibeIcon';
import NerdyGroupVibeIcon from './group-vibe-icons/NerdyGroupVibeIcon';

export function groupVibeIcons(
  vibe: GroupVibe,
  type: 'avatar' | 'icon'
): JSX.Element {
  switch (vibe) {
    case 'chill':
      switch (type) {
        case 'avatar':
          return <ChillGroupVibeAvatar />;
        case 'icon':
          return <ChillGroupVibeIcon />;
      }
      break;
    case 'first-timers':
      switch (type) {
        case 'avatar':
          return <FirstTimersGroupVibeAvatar />;
        case 'icon':
          return <FirstTimersGroupVibeIcon />;
      }
      break;
    case 'learning':
      switch (type) {
        case 'avatar':
          return <LearningGroupVibeAvatar />;
        case 'icon':
          return <LearningGroupVibeIcon />;
      }
      break;
    case 'nerdy':
      switch (type) {
        case 'avatar':
          return <NerdyGroupVibeAvatar />;
        case 'icon':
          return <NerdyGroupVibeIcon />;
      }
      break;
    case 'power':
      switch (type) {
        case 'avatar':
          return <PowerGroupVibeAvatar />;
        case 'icon':
          return <PowerGroupVibeIcon />;
      }
      break;
  }
  return <></>;
}

export function groupVibeLabels(vibe: GroupVibe): string {
  switch (vibe) {
    case 'chill':
      return 'Chill';
    case 'first-timers':
      return 'First-timers';
    case 'learning':
      return 'Learning';
    case 'nerdy':
      return 'Nerdy';
    case 'power':
      return 'Power';
  }
}
