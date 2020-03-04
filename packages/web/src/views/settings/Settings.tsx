import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { Redirect, RouteComponentProps } from 'react-router';

import { EmailSettings, User, UserSettings } from '@caravanapp/types';
import {
  Button,
  Container,
  createStyles,
  IconButton,
  makeStyles,
  Theme,
  Typography,
} from '@material-ui/core';
import { ArrowBackIos } from '@material-ui/icons';

import {
  DEFAULT_EMAIL_SETTINGS,
  EMAIL_SETTINGS_KEYS_DESCRIPTIONS,
} from '../../common/globalConstants';
import CheckboxSettingsEditor from '../../components/CheckboxSettingsEditor';
import CustomSnackbar, {
  CustomSnackbarProps,
} from '../../components/CustomSnackbar';
import Header from '../../components/Header';
import HeaderTitle from '../../components/HeaderTitle';
import ProfileHeaderIcon from '../../components/ProfileHeaderIcon';
import UserEmailField from '../../components/UserEmailField';
import { getMySettings, updateMySettings } from '../../services/userSettings';

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
  const [snackbarProps, setSnackbarProps] = React.useState<CustomSnackbarProps>(
    {
      autoHideDuration: 6000,
      isOpen: false,
      handleClose: onSnackbarClose,
      variant: 'success',
    }
  );
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

  const onSaveSettings = async () => {
    if (!settings) {
      throw new Error('Attempted to save user settings that were undefined.');
    }
    const res = await updateMySettings(settings);
    if (res.status === 200) {
      setMadeChanges(false);
      setSnackbarProps({
        ...snackbarProps,
        isOpen: true,
        variant: 'success',
        message: 'Successfully updated your settings!',
      });
    } else {
      setSnackbarProps({
        ...snackbarProps,
        isOpen: true,
        variant: 'warning',
        message: 'Whoops, we ran into some trouble saving your settings.',
      });
    }
  };

  function onSnackbarClose() {
    setSnackbarProps({ ...snackbarProps, isOpen: false });
  }

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
        <CheckboxSettingsEditor<EmailSettings>
          label="I would like to receive emails that"
          onChange={newVal => onChangeSettings('emailSettings', newVal)}
          options={EMAIL_SETTINGS_KEYS_DESCRIPTIONS}
          showSelectAllButtons={true}
          value={settings ? settings.emailSettings : DEFAULT_EMAIL_SETTINGS}
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
      <CustomSnackbar {...snackbarProps} />
    </>
  );
}
