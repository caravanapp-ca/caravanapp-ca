import { ChannelSource, GroupVibe, ReadingSpeed } from './index';

export interface GetClubById {
  _id: string;
  name: string;
  ownerId: string;
  shelf: any[];
  bio: string;
  members: any[];
  maxMembers: number;
  vibe: GroupVibe;
  readingSpeed: ReadingSpeed;
  channelSource: ChannelSource;
  channelId: string;
  createdAt: string;
  updatedAt: string;
  private: boolean;
}
