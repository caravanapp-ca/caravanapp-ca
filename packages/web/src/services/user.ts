import axios from 'axios';
import {
  ReadingSpeed,
  User,
  UserShelfEntry,
  FilterAutoMongoKeys,
  ActiveFilter,
  Services,
  UserSearchField,
} from '@caravan/buddy-reading-types';
import { clearStorageAuthState } from '../common/localStorage';
import { clearCookieAuthState } from '../common/cookies';

const userRoute = '/api/user';

export async function getMe() {
  const res = await axios.get<User | null>(`${userRoute}/@me`);
  return res;
}

export async function getUser(userId: string) {
  const res = await axios.get<User | null>(`${userRoute}/${userId}`);
  const user = res.data;
  return user;
}

export async function getAllUsers(
  after?: string,
  onboardVersion?: number,
  pageSize?: number,
  search?: string,
  userSearchField?: UserSearchField,
  activeFilter?: ActiveFilter
) {
  const res = await axios.get<Services.GetUsers>(userRoute, {
    params: {
      after,
      onboardVersion,
      pageSize,
      search,
      userSearchField,
      activeFilter,
    },
  });
  return res;
}

export async function isSlugAvailable(slug: string) {
  try {
    const res = await axios.post<string>(`${userRoute}/${slug}/available`);
    if (res.status === 200) {
      return { available: true, err: null };
    } else {
      return { available: false, err: null };
    }
  } catch (err) {
    const { response } = err;
    if (response.status === 409) {
      return { available: false, err: null };
    } else {
      return { available: false, err: err.message };
    }
  }
}

interface UpdateUserProps {
  notStartedShelf: FilterAutoMongoKeys<UserShelfEntry>[];
  readingSpeed: ReadingSpeed;
  selectedGenres: User['selectedGenres'];
  questions: User['questions'];
  onboardingVersion: number;
}

export async function updateUserProfile({
  notStartedShelf,
  readingSpeed,
  selectedGenres,
  questions,
  onboardingVersion,
}: UpdateUserProps) {
  const body: Pick<
    User,
    'questions' | 'readingSpeed' | 'selectedGenres' | 'onboardingVersion'
  > & {
    shelf: {
      notStarted: FilterAutoMongoKeys<UserShelfEntry>[];
      read: FilterAutoMongoKeys<UserShelfEntry>[];
    };
  } = {
    selectedGenres: selectedGenres,
    shelf: {
      notStarted: notStartedShelf,
      read: [],
    },
    readingSpeed: readingSpeed,
    questions: questions,
    onboardingVersion: onboardingVersion,
  };
  const res = await axios.put(`${userRoute}`, body);
  return res;
}

export async function modifyUser(user: User) {
  const res = await axios.put(userRoute, user);
  return res;
}

export async function logout() {
  clearStorageAuthState();
  clearCookieAuthState();
  window.location.href = '/clubs';
}
