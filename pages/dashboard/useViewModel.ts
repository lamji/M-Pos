import useStyles from './useStyles';

export default function useViewModel() {
  const classes = useStyles();
  return { classes };
}
