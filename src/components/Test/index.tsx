import React from 'react';
import useViewModel from './useViewModel';
import { Typography } from '@mui/material';

export default function TestComponent() {
  const { test } = useViewModel();

  return (
    <div>
      <Typography sx={{ color: 'primary.main' }}>{test}</Typography>
    </div>
  );
}
