import React from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import './SearchResultCards.css';

const useStyles = makeStyles(theme => ({
  cardGrid: {
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  cardContent: {
    height: '200px',
    flexGrow: 1,
    padding: 10,
  },
  cardActions: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: '5px',
  },
  addButton: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginRight: 10,
    marginBottom: 10,
    color: 'white',
    backgroundColor: '#7289da',
    borderRadius: 30,
    paddingLeft: 15,
    paddingRight: 15,
  },
}));

// TODO pull cards from DB
const cards = [1, 2, 3, 4, 5, 6, 7, 8];

export default function SearchResultCards() {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={2}>
            {cards.map(card => (
              <Grid item key={card} xs={12} sm={12}>
                <Card className={classes.card}>
                  <CardContent className={classes.cardContent}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        width: '100%',
                      }}
                    >
                      <div className="SearchResult">
                        <img
                          src="https://images.gr-assets.com/books/1429638085l/4929.jpg"
                          alt=""
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: 30,
                        }}
                      >
                        <Typography variant="h4">Kafka on the Shore</Typography>
                        <Typography variant="h5">Haruki Murakami</Typography>
                        <Typography variant="h5" component="h6">
                          Fantasy
                        </Typography>
                      </div>
                    </div>
                  </CardContent>
                  <CardActions className={classes.cardActions}>
                    <Button
                      variant="contained"
                      className={classes.addButton}
                      size="small"
                    >
                      Add
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
