import React, { useEffect } from 'react';
import { User } from '@caravan/buddy-reading-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles, Theme } from '@material-ui/core';
import { isSlugAvailable } from '../../services/user';
import { debounce } from '../../common/utils';
import SlugView, { SlugValidationState } from './SlugView';

interface UserSettingsProps {
  user: User;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    loadingContainer: {
      display: 'flex',
      justifyContent: 'center',
      justifyItems: 'center',
    },
  })
);

type EditState = 'Not Editable' | 'Editable' | 'Editing';

export default function UserSettings(props: UserSettingsProps) {
  const classes = useStyles();
  const { user } = props;
  const [slugValidationState, setSlugValidationState] = React.useState<
    SlugValidationState
  >('default');
  const [updatedSlug, setUpdatedSlug] = React.useState<string>('');

  useEffect(() => {
    if (user) {
      if (user.urlSlug === updatedSlug) {
      } else if (updatedSlug.length) {
      }
    }
  }, [updatedSlug, user]);

  let currentSlug = '';
  const onUpdateSlug = (newSlug: string) => {
    const updateSlug = async (s: string) => {
      setSlugValidationState('loading');
      currentSlug = s;
      // This section may not work due to modifying while network call made
      const res = await isSlugAvailable(s);
      if (currentSlug === s) {
        if (res.available) {
          setSlugValidationState('valid');
        } else {
          setSlugValidationState('taken');
        }
      }
    };
    setUpdatedSlug(newSlug);
    if (newSlug.length < 5 || newSlug.length > 20) {
      setSlugValidationState('invalid');
      return;
    }
    if (user && user.urlSlug === newSlug) {
      setSlugValidationState('default');
      return;
    }
    debounce(() => updateSlug(newSlug), 400, {
      isImmediate: newSlug.length < 5 || newSlug.length > 20,
    })();
  };

  if (!user) {
    return (
      <div className={classes.loadingContainer}>
        Loading user...
        <CircularProgress />
      </div>
    );
  }
  return (
    <div className={classes.container}>
      <SlugView
        slug={updatedSlug}
        onUpdateSlug={onUpdateSlug}
        validationState={slugValidationState}
      />
    </div>
  );
}
