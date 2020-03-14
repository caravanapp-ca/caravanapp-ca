import React from 'react';

import { PostSearchField } from '@caravanapp/types';
import {
  FormControl,
  InputLabel,
  makeStyles,
  MenuItem,
  Select,
} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  dialogStyle: {
    padding: 0,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingTop: 12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

interface PostSearchFilterProps {
  handleChange: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;
  searchField: PostSearchField;
}

export default function PostSearchFilter(props: PostSearchFilterProps) {
  const classes = useStyles();

  const { handleChange, searchField } = props;

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="post-search-simple">Find shelves</InputLabel>
        <Select
          value={searchField}
          onChange={handleChange}
          inputProps={{
            name: 'post-search',
            id: 'post-search-simple',
          }}
          disableUnderline
        >
          <MenuItem value={'bookTitle'}>By book title</MenuItem>
          <MenuItem value={'bookAuthor'}>By book author</MenuItem>
          <MenuItem value={'postTitle'}>By shelf title</MenuItem>
        </Select>
      </FormControl>
    </form>
  );
}
