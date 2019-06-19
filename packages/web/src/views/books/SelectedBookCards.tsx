import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import './SelectedBookCards.css';

const useStyles = makeStyles(theme => ({
  cardGrid: {
    padding: 0,
    marginBottom: 30,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    borderRadius: 10,
  },
  cardContent: {
    height: '100px',
    flexGrow: 1,
    padding: 10,
  },
  cardActions: {
    flexDirection: 'column',
    justifyContent: 'center',
    width: '40px',
    padding: '0px',
  },
}));

// TODO pull cards from DB
const cards = [1, 2];

export default function SelectedBookCards() {
  const classes = useStyles();

  const [firstBook, setFirstBook] = React.useState('1');

  function handleFirstBookChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFirstBook(event.target.value);
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <Typography
          style={{
            marginBottom: 20,
            fontSize: 14,
            color: '#4B4B4B',
            textAlign: 'center',
            fontWeight: 'bold',
          }}
          variant="subtitle2"
        >
          Select which book you'll be reading first! The rest will go to your
          'To Be Read' list.
        </Typography>
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
                      <div>
                        <img
                          style={{
                            width: '50px',
                            height: '80px',
                            overflow: 'hidden',
                            borderRadius: '10%',
                          }}
                          src="https://images.gr-assets.com/books/1429638085l/4929.jpg"
                          alt=""
                        />
                      </div>
                      <div
                        style={{
                          marginLeft: 10,
                          flexDirection: 'column',
                          width: '100%',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          style={{ fontSize: 16, color: '#8B8B8B' }}
                          variant="h4"
                        >
                          Kafka on the Shore
                        </Typography>
                        <Typography
                          style={{ fontSize: 14, color: '#C8C8C8' }}
                          variant="h5"
                        >
                          Haruki Murakami
                        </Typography>
                        <Typography
                          style={{ fontSize: 14, color: '#C8C8C8' }}
                          variant="h5"
                          component="h6"
                        >
                          Fantasy
                        </Typography>
                      </div>
                      <CardActions className={classes.cardActions}>
                        <Radio
                          checked={firstBook === '2'}
                          onChange={handleFirstBookChange}
                          value="2"
                          style={{
                            color: '#7289da',
                            position: 'relative',
                            bottom: '6px',
                          }}
                          name="radio-button-demo"
                          inputProps={{ 'aria-label': '2' }}
                        />
                        <IconButton
                          aria-label="Delete"
                          style={{
                            position: 'relative',
                            right: '4px',
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </CardActions>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </main>
    </React.Fragment>
  );
}
