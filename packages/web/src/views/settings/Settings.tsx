import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  Typography,
  Container,
  Button,
} from '@material-ui/core';
import { Redirect } from 'react-router';
import { User, UserSettings } from '@caravan/buddy-reading-types';
import clsx from 'clsx';
import { getMySettings } from '../../services/userSettings';
import UserEmailField from '../../components/UserEmailField';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: `${theme.spacing(8)}px 16px`,
    },
    sectionContainer: {
      marginTop: theme.spacing(4),
    },
    buttonsContainer: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      alignItems: 'center',
      width: '100%',
    },
  })
);

interface SettingsProps {
  user: User | null;
}

const getSettings = async () => {
  const settingsRes = await getMySettings();
  if (settingsRes.status === 200) {
    return settingsRes.data;
  } else {
    return undefined;
  }
};

export default function Settings(props: SettingsProps) {
  const { user } = props;
  const [settings, setSettings] = useState<UserSettings>();
  const classes = useStyles();

  useEffect(() => {
    if (user) {
      getSettings().then(settings => setSettings(settings));
    }
  }, [user]);

  if (!user) {
    return <Redirect to="/" />;
  }

  const onChangeSettings = (field: 'email', newVal: string) => {
    if (!settings) {
      throw new Error('Attempted to update user settings that were undefined.');
    }
    setSettings({ ...settings, [field]: newVal });
  };

  const onSaveSettings = () => {};

  return (
    <Container className={classes.container} maxWidth="md">
      <Typography variant="h3">Settings</Typography>
      <div className={classes.sectionContainer}>
        <Typography variant="h5">Email Preferences</Typography>
        <UserEmailField
          value={settings ? settings.email : undefined}
          onChange={newVal => onChangeSettings('email', newVal)}
        />
      </div>
      <div className={clsx(classes.sectionContainer, classes.buttonsContainer)}>
        <Button color="secondary" variant="contained" onClick={onSaveSettings}>
          <Typography variant="button">SAVE</Typography>
        </Button>
      </div>
    </Container>
  );
}
