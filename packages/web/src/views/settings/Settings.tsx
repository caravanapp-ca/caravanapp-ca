import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  Typography,
  Container,
  Button,
  IconButton,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';
import { Redirect, RouteComponentProps } from 'react-router';
import {
  User,
  UserSettings,
  EmailSettings,
} from '@caravan/buddy-reading-types';
import clsx from 'clsx';
import { getMySettings } from '../../services/userSettings';
import UserEmailField from '../../components/UserEmailField';
import UserEmailSettings from './UserEmailSettings';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      padding: `${theme.spacing(8)}px 16px`,
    },
    sectionContainer: {
      marginTop: theme.spacing(4),
    },
    subsectionContainer: {
      marginTop: theme.spacing(2),
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

interface SettingsProps extends RouteComponentProps {
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

const centerComponent = <HeaderTitle title="Settings" />;

export default function Settings(props: SettingsProps) {
  const { user } = props;
  const [settings, setSettings] = useState<UserSettings>();
  const [madeChanges, setMadeChanges] = useState<boolean>(false);
  const classes = useStyles();

  const backButtonAction = () => {
    if (props.history.length > 2) {
      props.history.goBack();
    } else {
      props.history.replace('/');
    }
  };

  const rightComponent = <ProfileHeaderIcon user={user} />;
  const leftComponent = (
    <IconButton
      edge="start"
      color="inherit"
      aria-label="Back"
      onClick={backButtonAction}
    >
      <ArrowBackIos />
    </IconButton>
  );

  useEffect(() => {
    if (user) {
      getSettings().then(settings => setSettings(settings));
    }
  }, [user]);

  if (!user) {
    return <Redirect to="/" />;
  }

  const onChangeSettings = (
    field: 'email' | 'emailSettings',
    newVal: string | EmailSettings,
    valid?: boolean
  ) => {
    if (!settings) {
      throw new Error('Attempted to update user settings that were undefined.');
    }
    setSettings({ ...settings, [field]: newVal });
    if (valid === false) {
      setMadeChanges(false);
    } else {
      setMadeChanges(true);
    }
  };

  const onSaveSettings = () => {
    if (!settings) {
      throw new Error('Attempted to save user settings that were undefined.');
    }
    updateMySettings(settings);
  };

  return (
    <>
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <Container className={classes.container} maxWidth="md">
        <Typography variant="h5" gutterBottom>
          Email Preferences
        </Typography>
        <UserEmailField
          value={settings ? settings.email : undefined}
          onChange={(newVal, valid) => onChangeSettings('email', newVal, valid)}
        />
        <UserEmailSettings
          value={settings ? settings.emailSettings : undefined}
          onChange={newVal => onChangeSettings('emailSettings', newVal)}
        />
        <div
          className={clsx(classes.sectionContainer, classes.buttonsContainer)}
        >
          <Button
            color="secondary"
            variant="contained"
            onClick={onSaveSettings}
            disabled={!madeChanges}
          >
            <Typography variant="button">SAVE</Typography>
          </Button>
        </div>
      </Container>
    </>
  );
}
