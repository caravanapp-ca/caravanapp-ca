import axios from 'axios';
import { ReadingSpeed, User } from '@caravan/buddy-reading-types';

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
  notStartedShelf: User['shelf']['notStarted'];
  readingSpeed: ReadingSpeed;
  selectedGenres: User['selectedGenres'];
  questions: User['questions'];
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
    | 'questions'
    | 'readingSpeed'
    | 'selectedGenres'
    | 'shelf'
    | 'onboardingVersion'
  > = {
    selectedGenres: selectedGenres,
    shelf: {
      notStarted: notStartedShelf,
      read: [],
    },
    readingSpeed: readingSpeed,
    questions: questions,
    onboardingVersion: onboardingVersion,
  };
  console.log('Awaiting axios now');
  console.log(`${userRoute}`);
  const res = await axios.put(`${userRoute}`, body);

  return res;
}
