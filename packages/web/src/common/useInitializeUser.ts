import axios from 'axios';
import { useState, useEffect } from 'react';
import { UserDoc } from '@caravan/buddy-reading-types';
import { getCookie } from './cookies';

function useInitializeUser() {
  const [user, setUser] = useState<UserDoc | null>(null);
  useEffect(() => {
    const getUser = async () => {
      if (!user) {
        const hydratedUserJson = window.localStorage.getItem('user');
        if (!hydratedUserJson) {
          const userId = getCookie('userId');
          if (userId) {
            // Getting user data for the first time after login
            const userDocResponse = await axios.get<UserDoc | null>(
              `/api/user/${userId}`
            );
            const userDoc = userDocResponse.data;
            if (userDoc) {
              const dehydratedUser = JSON.stringify(userDoc);
              window.localStorage.setItem('user', dehydratedUser);
              setUser(userDoc);
            } else {
              console.info('Are you having fun messing with cookies? :)');
            }
          }
        } else {
          const hydratedUser = JSON.parse(hydratedUserJson);
          setUser(hydratedUser);
        }
      }
    };
    getUser();
  }, [user]);

  return user;
}

export default useInitializeUser;
