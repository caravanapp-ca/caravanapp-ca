import { UserPalettes, PaletteObject, PaletteSet } from '@caravanapp/types';

export const getSelectablePalettes = (
  palettes: PaletteObject[],
  userPalettes: UserPalettes | null,
  GLOBAL_PALETTE_SETS: PaletteSet[]
) => {
  const selectablePalettes = palettes.filter(f => {
    if (f.set && GLOBAL_PALETTE_SETS.includes(f.set)) {
      return true;
    }
    if (userPalettes) {
      if (
        f.set &&
        userPalettes.hasSets &&
        userPalettes.hasSets.includes(f.set)
      ) {
        return true;
      } else if (
        userPalettes.hasIndividuals &&
        userPalettes.hasIndividuals.includes(f.id)
      ) {
        return true;
      }
    }
    return false;
  });
  return selectablePalettes;
};
