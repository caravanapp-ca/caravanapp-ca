import React from 'react';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Radio from '@material-ui/core/Radio';
import BackIcon from '@material-ui/icons/ArrowBackIos';
import ThreeDotsIcon from '@material-ui/icons/MoreVert';
import AdapterLink from '../../components/AdapterLink';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import WalkIcon from '@material-ui/icons/DirectionsWalk';
import CarIcon from '@material-ui/icons/DirectionsCar';
import BikeIcon from '@material-ui/icons/DirectionsBike';
import ChillIcon from '@material-ui/icons/Toys';
import NerdyIcon from '@material-ui/icons/VideogameAsset';
import LearningIcon from '@material-ui/icons/School';
import FirstTimerIcon from '@material-ui/icons/Cake';
import PowerIcon from '@material-ui/icons/FlashOn';
import Header from '../../components/Header';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#7289da',
    },
  },
});
const useStyles = makeStyles(theme => ({
  //let { selectedGroupNameValue, selectedGroupBioValue } = React.useState();
  formContainer: {
    paddingTop: theme.spacing(5),
    paddingBottom: theme.spacing(8),
  },
  paper: {
    height: 160,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  addButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginRight: theme.spacing(2),
  },
  headerTitle: {
    flexGrow: 1,
    fontWeight: 'bold',
  },
  moreButton: {
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(0),
  },
  createButtonSection: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0px',
  },
  createButton: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: 16,
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#7289da',
  },
  addButton: {},
}));

export default function CreateClub() {
  const classes = useStyles();

  const leftComponent = (
    <IconButton
      edge="start"
      className={classes.backButton}
      color="inherit"
      aria-label="Back"
      component={AdapterLink}
      to="/"
    >
      <BackIcon />
    </IconButton>
  );

  const centerComponent = (
    <Typography variant="h6" className={classes.headerTitle}>
      Create a Group
    </Typography>
  );

  const rightComponent = (
    <IconButton
      edge="start"
      className={classes.moreButton}
      color="inherit"
      aria-label="More"
      component={AdapterLink}
      to="/"
    >
      <ThreeDotsIcon />
    </IconButton>
  );

  const [spacing] = React.useState<GridSpacing>(2);

  const [selectedGroupSizeValue, setSelectedGroupSizeValue] = React.useState(
    '4'
  );

  function handleGroupSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedGroupSizeValue(event.target.value);
  }

  const [selectedGroupSpeedValue, setSelectedGroupSpeedValue] = React.useState(
    'Moderate'
  );

  function handleGroupSpeedChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedGroupSpeedValue(event.target.value);
  }

  const [selectedGroupVibeValue, setSelectedGroupVibeValue] = React.useState(
    'Chill'
  );

  function handleGroupVibeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedGroupVibeValue(event.target.value);
  }

  const [selectedGroupNameValue, setSelectedGroupNameValue] = React.useState(
    ''
  );

  function handleGroupNameChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setSelectedGroupNameValue(e.target.value);
  }

  const [selectedGroupBioValue, setSelectedGroupBioValue] = React.useState('');

  function handleGroupBioChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setSelectedGroupBioValue(e.target.value);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <Header
        leftComponent={leftComponent}
        centerComponent={centerComponent}
        rightComponent={rightComponent}
      />
      <main>
        <Container className={classes.formContainer} maxWidth="md">
          <Typography
            style={{ fontWeight: 'bold', marginBottom: 10 }}
            variant="h5"
            component="h2"
          >
            Group name
          </Typography>
          <TextField
            id="standard-full-width"
            style={{ marginBottom: 30 }}
            placeholder="The Gang"
            helperText="50 character limit"
            variant="outlined"
            fullWidth
            inputProps={{ maxLength: 50 }}
            onChange={e => handleGroupNameChange(e)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <Typography
            style={{ fontWeight: 'bold', marginBottom: 20 }}
            variant="h5"
            component="h2"
          >
            What books would you like to read?
          </Typography>
          <Grid style={{ marginBottom: 30 }} item xs={12} sm={12}>
            <Grid container justify="space-around" spacing={spacing}>
              <Grid key={0} item>
                <div>
                  <Paper className={classes.paper}>
                    <IconButton
                      edge="start"
                      className={classes.addButton}
                      color="inherit"
                      aria-label="Add"
                      component={AdapterLink}
                      to="/findbooks"
                    >
                      <AddIcon />
                    </IconButton>
                  </Paper>
                </div>
              </Grid>
              <Grid key={1} item>
                <div>
                  <Paper className={classes.paper}>
                    <IconButton
                      edge="start"
                      className={classes.addButton}
                      color="inherit"
                      aria-label="Add"
                      component={AdapterLink}
                      to="/findbooks"
                    >
                      <AddIcon />
                    </IconButton>
                  </Paper>
                </div>
              </Grid>
              <Grid key={2} item>
                <div>
                  <Paper className={classes.paper}>
                    <IconButton
                      edge="start"
                      className={classes.addButton}
                      color="inherit"
                      aria-label="Add"
                      component={AdapterLink}
                      to="/findbooks"
                    >
                      <AddIcon />
                    </IconButton>
                  </Paper>
                </div>
              </Grid>
            </Grid>
          </Grid>

          <Typography
            style={{ fontWeight: 'bold', marginBottom: 20 }}
            variant="h5"
            component="h2"
          >
            How many group members do you want?
          </Typography>
          <div style={{ marginBottom: 30 }}>
            <MuiThemeProvider theme={theme}>
              <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Radio
                  checked={selectedGroupSizeValue === '2'}
                  onChange={handleGroupSizeChange}
                  value="2"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '2' }}
                />
                <Radio
                  checked={selectedGroupSizeValue === '3'}
                  onChange={handleGroupSizeChange}
                  value="3"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '3' }}
                />
                <Radio
                  checked={selectedGroupSizeValue === '4'}
                  onChange={handleGroupSizeChange}
                  value="4"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '4' }}
                />
                <Radio
                  checked={selectedGroupSizeValue === '5'}
                  onChange={handleGroupSizeChange}
                  value="5"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '5' }}
                />
                <Radio
                  checked={selectedGroupSizeValue === '6'}
                  onChange={handleGroupSizeChange}
                  value="6"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': '6' }}
                />
              </div>
              <div
                style={{
                  display: 'flex',
                  marginBottom: 20,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}
              >
                <Typography variant="h5" component="h2">
                  2
                </Typography>
                <Typography variant="h5" component="h2">
                  3
                </Typography>
                <Typography variant="h5" component="h2">
                  4
                </Typography>
                <Typography variant="h5" component="h2">
                  5
                </Typography>
                <Typography variant="h5" component="h2">
                  6
                </Typography>
              </div>
            </MuiThemeProvider>
          </div>

          <Typography
            style={{ fontWeight: 'bold', marginBottom: 20 }}
            variant="h5"
            component="h2"
          >
            How fast do you want the group to read?
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '80%',
              marginBottom: 30,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupSpeedValue === 'Slow'}
                  onChange={handleGroupSpeedChange}
                  value="Slow"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Slow' }}
                />
                <Typography
                  style={{ marginLeft: 10 }}
                  variant="h5"
                  component="h2"
                >
                  Slow
                </Typography>
              </div>
              <div>
                <WalkIcon style={{ fontSize: 50 }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupSpeedValue === 'Moderate'}
                  onChange={handleGroupSpeedChange}
                  value="Moderate"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Moderate' }}
                />
                <Typography
                  style={{ marginLeft: 10 }}
                  variant="h5"
                  component="h2"
                >
                  Moderate
                </Typography>
              </div>
              <div>
                <BikeIcon style={{ fontSize: 50 }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupSpeedValue === 'Fast'}
                  onChange={handleGroupSpeedChange}
                  value="Fast"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Fast' }}
                />
                <Typography
                  style={{ marginLeft: 10 }}
                  variant="h5"
                  component="h2"
                >
                  Fast
                </Typography>
              </div>
              <div>
                <CarIcon style={{ fontSize: 50 }} />
              </div>
            </div>
          </div>

          <Typography
            style={{ fontWeight: 'bold', marginBottom: 30 }}
            variant="h5"
            component="h2"
          >
            What vibe do you want the group to have?
          </Typography>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              width: '80%',
              marginBottom: 30,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibeValue === 'Chill'}
                  onChange={handleGroupVibeChange}
                  value="Chill"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Chill' }}
                />
                <Typography
                  style={{ marginLeft: 10 }}
                  variant="h5"
                  component="h2"
                >
                  Chill
                </Typography>
              </div>
              <div>
                <ChillIcon style={{ fontSize: 50 }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibeValue === 'Nerdy'}
                  onChange={handleGroupVibeChange}
                  value="Nerdy"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Nerdy' }}
                />
                <Typography
                  style={{ marginLeft: 10 }}
                  variant="h5"
                  component="h2"
                >
                  Nerdy
                </Typography>
              </div>
              <div>
                <NerdyIcon style={{ fontSize: 50 }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibeValue === 'Power'}
                  onChange={handleGroupVibeChange}
                  value="Power"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Power' }}
                />
                <Typography
                  style={{ marginLeft: 10 }}
                  variant="h5"
                  component="h2"
                >
                  Power
                </Typography>
              </div>
              <div>
                <PowerIcon style={{ fontSize: 50 }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibeValue === 'FirstTimer'}
                  onChange={handleGroupVibeChange}
                  value="FirstTimer"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'FirstTimer' }}
                />
                <Typography
                  style={{ marginLeft: 10 }}
                  variant="h5"
                  component="h2"
                >
                  First-timers
                </Typography>
              </div>
              <div>
                <FirstTimerIcon style={{ fontSize: 50 }} />
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Radio
                  checked={selectedGroupVibeValue === 'Learning'}
                  onChange={handleGroupVibeChange}
                  value="Learning"
                  style={{ color: '#7289da' }}
                  name="radio-button-demo"
                  inputProps={{ 'aria-label': 'Learning' }}
                />
                <Typography
                  style={{ marginLeft: 10 }}
                  variant="h5"
                  component="h2"
                >
                  Learning
                </Typography>
              </div>
              <div>
                <LearningIcon style={{ fontSize: 50 }} />
              </div>
            </div>
          </div>

          <Typography
            style={{ fontWeight: 'bold', marginBottom: 30 }}
            variant="h5"
            component="h2"
          >
            Group Bio
          </Typography>
          <TextField
            id="multiline-full-width"
            style={{ marginBottom: 20, width: '100%' }}
            placeholder="I'm looking for..."
            helperText="300 character limit"
            variant="outlined"
            onChange={e => handleGroupBioChange(e)}
            multiline
            rows="4"
            inputProps={{ maxLength: 300 }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <div className={classes.createButtonSection}>
            <Button
              variant="contained"
              disabled={
                selectedGroupBioValue === '' || selectedGroupNameValue === ''
              }
              className={classes.createButton}
              size="small"
            >
              Create
            </Button>
          </div>
        </Container>
      </main>
    </React.Fragment>
  );
}
