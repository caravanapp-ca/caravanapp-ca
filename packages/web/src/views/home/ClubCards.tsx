import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import RunnerIcon from '@material-ui/icons/DirectionsRun';
import PersonIcon from '@material-ui/icons/PersonOutline';
import GraduationCapIcon from '@material-ui/icons/School';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import './ClubCards.css';

const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent: {
    height: '200px',
    flexGrow: 1,
  },
  membersIcon: {
    display: 'flex',
    justifyContent: 'center',
  },
  vibeIcon: {
    display: 'flex',
    justifyContent: 'center',
  },
  speedIcon: {
    display: 'flex',
    justifyContent: 'center',
  },
  iconRoot: {
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  cardActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: '0px',
  },
  infoButton: {
    fontSize: '20px',
    color: '#7289da',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  joinButton: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginRight: 16,
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#7289da',
  },
}));

// TODO pull cards from DB
const cards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function ClubCards() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {cards.map(card => (
              <Grid item key={card} xs={12} sm={6}>
                <Card className={classes.card}>
                  <div className="Club-image">
                    <img
                      src="https://images.gr-assets.com/books/1429638085l/4929.jpg"
                      alt=""
                    />
                    <h1>Currently reading</h1>
                    <h2>Kafka on the Shore</h2>
                    <h3>Haruki Murakami, 2002</h3>
                    <h4>(Fantasy)</h4>
                  </div>
                  <CardContent className={classes.cardContent}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Sci-fi & Fantasy Club
                    </Typography>
                    <div className={classes.iconRoot}>
                      <div className={classes.membersIcon}>
                        <PersonIcon style={{ marginRight: 10 }} />
                        <Typography variant="subtitle1">2/3</Typography>
                      </div>
                      <div className={classes.vibeIcon}>
                        <GraduationCapIcon style={{ marginRight: 10 }} />
                        <Typography variant="subtitle1">Learning</Typography>
                      </div>
                      <div className={classes.speedIcon}>
                        <RunnerIcon style={{ marginRight: 10 }} />
                        <Typography variant="subtitle1">Fast</Typography>
                      </div>
                    </div>
                    <Typography>
                      Hey everyone! This is a group for people looking to read
                      both classic and new age Sci-fi and fantasy novels. We
                      discuss all aspects of the story, and have lots of fun!
                    </Typography>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Button className={classes.infoButton} size="small">
                      Info
                    </Button>
                    <Button
                      variant="contained"
                      className={classes.joinButton}
                      size="small"
                    >
                      Join
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
