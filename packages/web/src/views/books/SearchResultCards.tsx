import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import { GoogleBooks } from '@caravan/buddy-reading-types';
import './SelectedBookCards.css';

interface ResultsProps {
  searchResultObject: GoogleBooks.Item[] | null;
  onSelected: (book: GoogleBooks.Item) => void;
}

const useStyles = makeStyles(theme => ({
  searchResultsList: {
    width: '100%',
    borderColor: '#7289da',
    position: 'absolute',
    backgroundColor: 'white',
    top: '47px',
    left: 0,
    zIndex: 1,
    elevation: 3,
    boxShadow: '0 3px 5px 2px #C8C8C8',
  },
  searchResult: {
    padding: 5,
    marginTop: 0,
    marginBottom: 0,
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
  },
  cardContent: {
    height: '100px',
    flexGrow: 1,
    padding: 10,
  },
  cardActions: {
    justifyContent: 'flex-end',
    width: '40px',
    padding: '0px',
  },
  addBookButton: {
    position: 'relative',
    left: '5px',
    bottom: '5px',
  },
}));

export default function SearchResultCards(props: ResultsProps) {
  const classes = useStyles();

  return (
    <React.Fragment>
      <CssBaseline />
      <main>
        <GridList
          cellHeight={100}
          className={classes.searchResultsList}
          cols={1}
        >
          {(props.searchResultObject || []).map((result, index) => (
            <GridListTile
              cols={1}
              className={classes.searchResult}
              key={`${result.id}_${index}`}
            >
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
                          border: '1px solid #C8C8C8',
                        }}
                        src={
                          ('imageLinks' in result.volumeInfo &&
                            result.volumeInfo.imageLinks.thumbnail) ||
                          'https://www.newel.com/img/inventory/no_image_available_300x300.jpg'
                        }
                        alt=""
                      />
                    </div>
                    <div
                      style={{
                        marginLeft: 10,
                        flexDirection: 'column',
                        width: '100%',
                        height: 100,
                        justifyContent: 'flex-start',
                        alignItems: 'flex-start',
                        display: 'flex',
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: 16,
                          color: '#8B8B8B',
                        }}
                        variant="h4"
                      >
                        {result.volumeInfo.title.length > 35
                          ? result.volumeInfo.title.substring(0, 35) + '...'
                          : result.volumeInfo.title}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: 14,
                          color: '#C8C8C8',
                        }}
                        variant="h5"
                      >
                        {('authors' in result.volumeInfo &&
                          result.volumeInfo.authors[0]) ||
                          'Unknown Author'}
                      </Typography>
                      <Typography
                        style={{ fontSize: 14, color: '#C8C8C8' }}
                        variant="h5"
                        component="h6"
                      >
                        {('categories' in result.volumeInfo &&
                          result.volumeInfo.categories) ||
                          'Unknown Genre'}
                      </Typography>
                    </div>
                    <CardActions className={classes.cardActions}>
                      <IconButton
                        edge="start"
                        className={classes.addBookButton}
                        color="inherit"
                        aria-label="AddBook"
                        onClick={() => props.onSelected(result)}
                      >
                        <AddIcon />
                      </IconButton>
                    </CardActions>
                  </div>
                </CardContent>
              </Card>
            </GridListTile>
          ))}
        </GridList>
      </main>
    </React.Fragment>
  );
}
