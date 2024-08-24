import * as React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { Typography } from '@mui/material';
import Image from 'next/image';
interface Props {
  images: any;
  header: string;
  height: number;
  width: number;
  onClick: () => void;
}

export default function SimplePaper({ images, header, height, width, onClick }: Props) {
  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 128,
          height: 128,
          p: 1,
          position: 'relative', // Make sure the Paper component is positioned relative to its container
        },
      }}
    >
      <Paper elevation={3}>
        <Typography fontWeight={700}>{header}</Typography>
        <Box
          sx={{
            position: 'absolute', // Position the box absolutely within the Paper
            bottom: -10, // Adjust this value to control how far the image is from the bottom
            right: 8, // Adjust this value to control how far the image is from the right side
          }}
        >
          <Image src={images} width={width} height={height} alt="Picture of the author" />
        </Box>
      </Paper>
    </Box>
  );
}
