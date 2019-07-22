import React, { ChangeEvent } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, createStyles, TextField, IconButton } from '@material-ui/core';
import { Services } from '@caravan/buddy-reading-types';
import { Search } from '@material-ui/icons';
import { searchClubs } from '../../services/club';

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
  onSearchResRetrieved: (clubs: Services.GetClubs['clubs']) => void;
}

const validSearch = (searchStr: string): boolean => {
  if (searchStr.trim().length === 0) {
    return false;
  } else {
    return true;
  }
};

export default function FilterSearch(props: FilterSearchProps) {
  const classes = useStyles();
  const { onClearSearch, onSearchResRetrieved } = props;
  const [searchStr, setSearchStr] = React.useState<string>('');

  const callSearchClubs = async () => {
    const res = await searchClubs(searchStr);
    if (res.status === 200) {
      onSearchResRetrieved(res.data);
    } else {
      // TODO: Failed search error handling
    }
  };

  const handleOnKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter' && validSearch(searchStr)) {
      callSearchClubs();
    }
  };

  const handleSearchClick = () => {
    if (validSearch(searchStr)) {
      callSearchClubs();
    }
  };

  const handleOnChange = (
    e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
  ) => {
    setSearchStr(e.target.value);
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
        label="Search clubs by club name, book title, or author"
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
