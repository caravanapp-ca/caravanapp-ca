import React, { useEffect } from 'react';
import {
  FormControl,
  makeStyles,
  Theme,
  createStyles,
  InputLabel,
  Select,
  OutlinedInput,
  Typography,
  useTheme,
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
      name?: string | undefined;
      value: unknown;
    }>,
    child: React.ReactNode
  ) => void;
  selectedSize: string;
  showContactMessage?: boolean;
  sizes: {
    label: string;
    enabled: boolean;
  }[];
}

export default function GroupSizeSelector(props: GroupSizeSelectorProps) {
  const classes = useStyles();
  const theme = useTheme();
  const { onChangeSize, selectedSize, showContactMessage, sizes } = props;
  const labelRef = React.useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);

  useEffect(() => {
    if (labelRef.current) {
      setLabelWidth(labelRef.current.offsetWidth);
    }
  }, []);

  return (
    <>
      {showContactMessage && (
        <Typography
          variant="body2"
          color="textSecondary"
          style={{ fontStyle: 'italic', marginBottom: theme.spacing(1) }}
        >
          If you require more group members, please contact the Caravan team on
          Discord.
        </Typography>
      )}
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
