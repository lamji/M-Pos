import { SxProps, Theme } from '@mui/material';

export interface IBanner {
  name: string;
  slogan: string;
  headerStyle?: SxProps<Theme>;
  subHeaderStyle?: SxProps<Theme>;
  backgroundColor: string;
  featured_image: string;
  buttonLabel: string;
  buttonClick: () => void;
}
