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
    display: 'flex'
  },
  addButton: {
  },
}));

export default function CreateClub() {
  const classes = useStyles();
  const [spacing] = React.useState<GridSpacing>(2);

  const [selectedValue, setSelectedValue] = React.useState('a');

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setSelectedValue(event.target.value);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          <Typography style={{marginBottom: 10}}  variant="h5" component="h2">
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
          <Typography style={{marginBottom: 30}} variant="h5" component="h2">
            What books would you like to read?
          </Typography>
          <Grid style={{ marginBottom: 20 }} item xs={12} sm={12}>
            <Grid container justify="space-around" spacing={spacing}>
              {[0, 1, 2].map(value => (
                <Grid key={value} item>
                  <div>
                    <Paper className={classes.paper}>
                      <IconButton edge="start" className={classes.addButton} color="inherit" aria-label="Add" component={AdapterLink} to="/">
                        <AddIcon />
                      </IconButton>
                    </Paper>
                  </div>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Typography style={{marginBottom: 30}} variant="h5" component="h2">
            How many group members do you want?
          </Typography>
          <MuiThemeProvider theme = { theme }>
            <div style={{display: 'flex', justifyContent: 'space-around'}}>
              <Radio
                checked={selectedValue === '2'}
                onChange={handleChange}
                value="2"
                name="radio-button-demo"
                inputProps={{ 'aria-label': '2' }}
              />
              <Radio
                checked={selectedValue === '3'}
                onChange={handleChange}
                value="3"
                name="radio-button-demo"
                inputProps={{ 'aria-label': '3' }}
              />
              <Radio
                checked={selectedValue === '4'}
                onChange={handleChange}
                value="4"
                name="radio-button-demo"
                inputProps={{ 'aria-label': '4' }}
              />
              <Radio
                checked={selectedValue === '5'}
                onChange={handleChange}
                value="5"
                name="radio-button-demo"
                inputProps={{ 'aria-label': '5' }}
              />
              <Radio
                checked={selectedValue === '6'}
                onChange={handleChange}
                value="6"
                name="radio-button-demo"
                inputProps={{ 'aria-label': '6' }}
              />
            </div>
          </MuiThemeProvider>
        </Container>
      </main>
    </React.Fragment>
  );
}
