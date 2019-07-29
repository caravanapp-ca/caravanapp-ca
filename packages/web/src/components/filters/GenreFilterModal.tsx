import React from 'react';
import { Services, FilterChip } from '@caravan/buddy-reading-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
} from '@material-ui/core';
import Button from '@material-ui/core/Button';
import GenreChip from '../../components/GenreChip';
import theme from '../../theme';

interface GenreFilterModalProps {
  allGenres: Services.GetGenres | null;
  filteredGenres: FilterChip[];
  onGenreSelected: (
    genreKey: string,
    genreName: string,
    selected: boolean
  ) => void;
  onClickClearFilter: () => void;
  onClickApply: () => void;
  open: boolean;
}

export default function GenreFilterModal(props: GenreFilterModalProps) {
  const {
    filteredGenres,
    allGenres,
    onGenreSelected,
    onClickClearFilter,
    onClickApply,
    open,
  } = props;

  const screenSmallerThanSm = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog open={open} onClose={onClickApply}>
      <DialogTitle id="alert-dialog-title">Filter Clubs by Genre</DialogTitle>
      <DialogContent>
        <div>
          {allGenres &&
            allGenres.mainGenres.map((genreKey: string) => {
              const genreSelected = filteredGenres.some(
                fg => fg.key === genreKey
              );
              return (
                <GenreChip
                  key={genreKey}
                  genreKey={genreKey}
                  name={allGenres.genres[genreKey].name}
                  active={genreSelected}
                  clickable={true}
                  onClick={() =>
                    onGenreSelected(
                      genreKey,
                      allGenres.genres[genreKey].name,
                      !genreSelected
                    )
                  }
                  small={screenSmallerThanSm}
                />
              );
            })}
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClickClearFilter}
          disabled={filteredGenres.length === 0}
          color="primary"
        >
          CLEAR ALL
        </Button>
        <Button variant="contained" onClick={onClickApply} color="primary">
          APPLY
        </Button>
      </DialogActions>
    </Dialog>
  );
}
