import { useState, useEffect } from 'react';
import { UserDoc } from '@caravan/buddy-reading-types';
import { getCookie } from './cookies';
import { getUser } from '../services/user';

function useInitializeUser() {
  const [user, setUser] = useState<UserDoc | null>(null);
  const [checkedStore, setCheckedStore] = useState(false);
  useEffect(() => {
    const processUser = async () => {
      if (!user) {
        const hydratedUserJson = window.localStorage.getItem('user');
        if (!hydratedUserJson) {
          const userId = getCookie('userId');
          if (userId) {
            // Getting user data for the first time after login
            const userDoc = await getUser(userId);
            if (userDoc) {
              const dehydratedUser = JSON.stringify(userDoc);
              window.localStorage.setItem('user', dehydratedUser);
              setUser(userDoc);
            } else {
              console.info('Are you having fun messing with cookies? :)');
            }
          } else if (!checkedStore) {
            window.localStorage.removeItem('user');
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
