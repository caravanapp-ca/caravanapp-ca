import { useState, useEffect } from 'react';
import { User } from '@caravan/buddy-reading-types';
import { getCookie } from './cookies';
import { KEY_USER } from './localStorage';
import { getUser } from '../services/user';

function useUser() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    if (!user) {
      // July 03rd, 2019; we decided not to put user stuff into local storage
      // Can add back in later, but to reduce complexity, not now.
      window.localStorage.removeItem(KEY_USER);
      const userId = getCookie('userId');
      if (userId) {
        // Getting user data for the first time after login
        getUser(userId).then(user => {
          if (user) {
            setUser(user);
          } else {
            console.info('Are you having fun messing with cookies? :)');
          }
        });
      }
    }
  }, [user]);

  return user;
}

export default useUser;
