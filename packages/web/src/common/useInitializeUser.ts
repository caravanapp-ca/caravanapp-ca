import { useState, useEffect } from 'react';
import { User } from '@caravan/buddy-reading-types';
import { getCookie } from './cookies';
import { KEY_USER } from './localStorage';
import { getUser } from '../services/user';

function useInitializeUser() {
  const [user, setUser] = useState<User | null>(null);
  const [checkedStore, setCheckedStore] = useState(false);
  useEffect(() => {
    const processUser = async () => {
      if (!user) {
        const hydratedUserJson = window.localStorage.getItem(KEY_USER);
        if (!hydratedUserJson) {
          const userId = getCookie('userId');
          if (userId) {
            // Getting user data for the first time after login
            const user = await getUser(userId);
            if (user) {
              const dehydratedUser = JSON.stringify(user);
              window.localStorage.setItem(KEY_USER, dehydratedUser);
              setUser(user);
            } else {
              console.info('Are you having fun messing with cookies? :)');
            }
          } else if (!checkedStore) {
            window.localStorage.removeItem(KEY_USER);
            setCheckedStore(true);
          }
        } else {
          const hydratedUser = JSON.parse(hydratedUserJson);
          setUser(hydratedUser);
        }
      }
    };
    processUser();
  }, [user, checkedStore]);

  return user;
}

export default useInitializeUser;
