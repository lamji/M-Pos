import { useState } from 'react';
import { useStyles } from './useStyles';
import { useMediaQuery, useTheme } from '@mui/material';

import { useDispatch } from 'react-redux';
import { clearItems } from '@/src/common/reducers/items';

export default function useViewModel() {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClearItems = () => {
    dispatch(clearItems());
  };

  const handleClose = () => {
    setOpen(false);
  };
  return {
    classes,
    handleClickOpen,
    handleClose,
    fullScreen,
    open,
    handleClearItems,
  };
}
