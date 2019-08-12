import React from 'react';
import { UserSearchField } from '@caravan/buddy-reading-types';
import { Select, FormControl, InputLabel, MenuItem } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  dialogStyle: {
    padding: 0,
  },
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingTop: 12,
    paddingHorizontal: 12,
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
}));

interface UserSearchFilterProps {
  handleChange: (
    event: React.ChangeEvent<{ name?: string; value: unknown }>
  ) => void;
  searchField: UserSearchField;
}

export default function UserSearchFilter(props: UserSearchFilterProps) {
  const classes = useStyles();

  const { handleChange, searchField } = props;

  return (
    <form className={classes.root} autoComplete="off">
      <FormControl className={classes.formControl}>
        <InputLabel htmlFor="age-simple">Find readers</InputLabel>
        <Select
          value={searchField}
          onChange={handleChange}
          inputProps={{
            name: 'age',
            id: 'age-simple',
          }}
        >
          <MenuItem value={'username'}>By user name</MenuItem>
          <MenuItem value={'bookTitle'}>
            By title of book on their shelf
          </MenuItem>
          <MenuItem value={'bookAuthor'}>
            By author of book on their shelf
          </MenuItem>
        </Select>
      </FormControl>
    </form>
  );
}
