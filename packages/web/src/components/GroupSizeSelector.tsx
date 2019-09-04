import React, { useEffect } from 'react';
import {
  FormControl,
  makeStyles,
  Theme,
  createStyles,
  InputLabel,
  Select,
  OutlinedInput,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 200,
    },
    group: {
      margin: theme.spacing(1, 0),
    },
  })
);

interface GroupSizeSelectorProps {
  onChangeSize: (
    event: React.ChangeEvent<{
      name?: string;
      value: unknown;
    }>,
    child: React.ReactNode
  ) => void;
  selectedSize: string;
  sizes: {
    label: string;
    enabled: boolean;
  }[];
  disabled?: boolean;
}

export default function GroupSizeSelector(props: GroupSizeSelectorProps) {
  const classes = useStyles();
  const { onChangeSize, selectedSize, sizes, disabled } = props;
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  useEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth);
    }
  }, []);

  return (
    <>
      <FormControl variant="outlined" className={classes.formControl}>
        <InputLabel ref={labelRef} htmlFor="group-size-select">
          Max club members
        </InputLabel>
        <Select
          native
          value={selectedSize}
          onChange={onChangeSize}
          input={
            <OutlinedInput
              labelWidth={labelWidth}
              name="Group Size"
              id="group-size-select"
            />
          }
          disabled={disabled}
        >
          {sizes.map(size => (
            <option
              key={size.label}
              value={size.label}
              disabled={!size.enabled}
            >
              {size.label}
            </option>
          ))}
        </Select>
      </FormControl>
    </>
  );
}
