import React from 'react';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import Radio from '@material-ui/core/Radio';

import AdapterLink from '../../components/AdapterLink';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';

import purple from '@material-ui/core/colors/purple';

const theme = createMuiTheme({
  palette: {
    primary: purple,
    secondary: {
      main: '#7289da',
    },
  },
});
const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  paper: {
    height: 160,
    width: 100,
    justifyContent: 'center',
    alignItems: 'center',
    display: 'flex',
  },
  addButton: {},
}));

export default function CreateClub() {
  const classes = useStyles();
  const [spacing] = React.useState<GridSpacing>(2);

  const [selectedGroupSizeValue, setSelectedGroupSizeValue] = React.useState(
    '2'
  );

  function handleGroupSizeChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedGroupSizeValue(event.target.value);
  }

  const [selectedGroupSpeedValue, setSelectedGroupSpeedValue] = React.useState(
    'Slow'
  );

  function handleGroupSpeedChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedGroupSpeedValue(event.target.value);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          <Typography style={{ marginBottom: 10 }} variant="h5" component="h2">
            Group name
          </Typography>
          <TextField
            id="standard-full-width"
            style={{ marginBottom: 20 }}
            placeholder="My Reading Group"
            helperText="50 character limit"
            fullWidth
            InputLabelProps={{
              shrink: true,
            }}
          />
          <Typography style={{ marginBottom: 30 }} variant="h5" component="h2">
            What books would you like to read?
          </Typography>
          <Grid style={{ marginBottom: 20 }} item xs={12} sm={12}>
            <Grid container justify="space-around" spacing={spacing}>
              {[0, 1, 2].map(value => (
                <Grid key={value} item>
                  <div>
                    <Paper className={classes.paper}>
                      <IconButton
                        edge="start"
                        className={classes.addButton}
                        color="inherit"
                        aria-label="Add"
                        component={AdapterLink}
                        to="/"
                      >
                        <AddIcon />
                      </IconButton>
                    </Paper>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Typography style={{ marginBottom: 30 }} variant="h5" component="h2">
            How many group members do you want?
          </Typography>
          <MuiThemeProvider theme={theme}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <Radio
                checked={selectedGroupSizeValue === '2'}
                onChange={handleGroupSizeChange}
                value="2"
                name="radio-button-demo"
                inputProps={{ 'aria-label': '2' }}
              />
              <Radio
                checked={selectedGroupSizeValue === '3'}
                onChange={handleGroupSizeChange}
                value="3"
                name="radio-button-demo"
                inputProps={{ 'aria-label': '3' }}
              />
              <Radio
                checked={selectedGroupSizeValue === '4'}
                onChange={handleGroupSizeChange}
                value="4"
                name="radio-button-demo"
                inputProps={{ 'aria-label': '4' }}
              />
              <Radio
                checked={selectedGroupSizeValue === '5'}
                onChange={handleGroupSizeChange}
                value="5"
                name="radio-button-demo"
                inputProps={{ 'aria-label': '5' }}
              />
              <Radio
                checked={selectedGroupSizeValue === '6'}
                onChange={handleGroupSizeChange}
                value="6"
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
          <Typography style={{ marginBottom: 30 }} variant="h5" component="h2">
            How fast do you want the group to read?
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Radio
                  checked={selectedGroupSpeedValue === 'Slow'}
                  onChange={handleGroupSpeedChange}
                  value="Slow"
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
                <Typography variant="h5" component="h2">
                  Icon
                </Typography>
              </div>
            </div>
          </div>
        </Container>
      </main>
    </React.Fragment>
  );
}
