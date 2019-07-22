import React, { ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/styles';
import {
  Theme,
  createStyles,
  TextField,
  IconButton,
  useMediaQuery,
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import theme from '../../theme';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    searchContainer: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    textField: {},
    iconButton: {},
  })
);

interface FilterSearchProps {
  onClearSearch: () => void;
  onSearchSubmitted: (search: string) => void;
}

const validSearch = (search: string): boolean => {
  if (search.trim().length === 0) {
    return false;
  } else {
    return true;
  }
};

export default function FilterSearch(props: FilterSearchProps) {
  const classes = useStyles();
  const { onClearSearch, onSearchSubmitted } = props;
  const [search, setSearch] = React.useState<string>('');
  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  const handleOnKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter' && validSearch(search)) {
      onSearchSubmitted(search);
    }
  };

  const handleSearchClick = () => {
    if (validSearch(search)) {
      onSearchSubmitted(search);
    }
  };

  const handleOnChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearch(e.target.value);
    if (e.target.value.length === 0) {
      onClearSearch();
    }
  };

  return (
    <div className={classes.searchContainer}>
      <IconButton
        className={classes.iconButton}
        aria-label="Search"
        onClick={handleSearchClick}
      >
        <Search />
      </IconButton>
      <TextField
        id="club-search"
        label={
          screenSmallerThanSm
            ? 'Search clubs'
            : 'Search clubs by club name, book title, or author'
        }
        type="search"
        onChange={handleOnChange}
        onKeyDown={handleOnKeyDown}
        className={classes.textField}
        margin="normal"
        fullWidth
      />
    </div>
  );
}
